import React, { useState, useEffect, useContext } from 'react'
import loadingIcon from "./Walk.gif"
import PostContext from '../Context'

//Two URLs - one for production (url) one for development (devURL)
const url = "https://serverles-social-api.davidgw.workers.dev"
const devURL = "http://127.0.0.1:8787"


const getPosts = async () => {
    //Get a list of posts from the cloudflare KV namespace (handled by Worker)
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-type": "application/json" }
    })

    return response.json()
}
const putPost = async (content) => {
    // This is for updating the comments section of each post
    let response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify(content),
            headers: { "Content-type": "application/json" }
        }
    )
    return response
}

const Posts = () => {
    const [posts, setPosts] = useState([])
    const [showComments, setShowComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState([])
    const [posted] = useContext(PostContext)

    const loadPosts = async () => {
        //Initialise some state variables with the results from the GET request, and set some new arrays for handling UI interaction and adding comments
        const results = await getPosts()
        setLoading(false)
        setPosts(results)
        setShowComments(() => results.map((result) => ({ id: result.id, value: false })))
        setNewComment(() => results.map((result) => ({ id: result.id, value: "" })))
    }

    const addComment = async (postId, commentText) => {
        // Add some comments by de-struturing the post array, with a unique ID for each comment

        //TO DO - make 'by' = the currently 'logged in' user
        let updated
        posts.map(post => (
            post.id === postId ? updated = {
                ...post, comments: [...post.comments, { by: "anon user", date: new Date().toLocaleString(), text: commentText, id: String(Math.round((Date.now() * Math.random()))) }]
            } : { ...post }
        ))
        setNewComment("")
        await putPost(updated)
        await loadPosts()
    }

    useEffect(() => {
        //Call loadPosts when component first mounts, then only re-trigger if the (global)state of isPosted changes
        async function loadData() {
            await loadPosts()
        }
        loadData()
        return () => { }
    }, [posted.isPosted])

    const handleShowComment = (id) => {
        //set True/False on comments array
        setShowComments(
            showComments.map((comment) => (
                comment.id === id ? { ...comment, value: !comment.value }
                    : { ...comment }
            ))
        )
    }
    const handleAddComment = (id, value) => {
        //Handle user input for a new comment - more array destructuring magic
        setNewComment(
            newComment.map((comment) => (
                comment.id === id ? { ...comment, value: value }
                    : { ...comment }
            ))
        )
    }

    const colours = ["bg-pink-200", "bg-green-200", "bg-blue-200", "bg-yellow-100"]

    return (
        <div>
            <section className="w-full p-4 mx-auto md:w-2/3  lg:w-1/2 mb-40">
                {loading &&
                    <div className="flex justify-center ">
                        <img className="w-16 h-auto" src={loadingIcon} alt="loading" />
                        <h2>Loading Posts...</h2>
                    </div>
                }
                {
                    !loading && posts.length > 0 ?
                        posts.map((post, index) => (
                            <div key={index} className="border rounded-md my-16" >
                                <div className={`p-3 flex flex-col ${colours[index % colours.length]}`}>
                                    <div className="flex">
                                        <h1 className="text-xl font-bold text-red-400">{post.title}</h1>
                                        <h2 className="text-lg mx-10">{post.username}</h2>
                                    </div>
                                    <h3 className="text-sm" >{post.date}</h3>
                                </div>
                                <p className=" h-28 p-5 ">{post.content}</p>
                                <div className={`p-3 ${colours[index % colours.length]}`}>
                                    <div className="p-2">
                                        <h2 className="text-lg inline">Comments</h2>
                                        {post.comments.length > 0 && <button className="underline ml-4" onClick={() => handleShowComment(post.id)}>show {post.comments.length} comments</button>}
                                    </div>
                                    {newComment[index] !== undefined &&
                                        <div className="p-2">
                                            <input className="rounded-md ml-2 p-2" placeholder="write a comment" value={newComment[index].value} onChange={event => handleAddComment(post.id, event.target.value)} ></input>
                                            <button className="rounded-md ml-2 bg-pink-500 text-white p-2" onClick={() => addComment(post.id, newComment[index].value)} >Submit comment</button>
                                        </div>
                                    }
                                </div>
                                {showComments[index] !== undefined && showComments[index].value === true &&
                                    <div className=" h-auto p-5 ">
                                        {post.comments.length > 0 ? post.comments.map((comment, index) => (
                                            <span key={index}>
                                                <h3 className="text-gray-400 mb-2">{comment.date} {comment.by}</h3>
                                                <p className="mb-2">{comment.text}</p>
                                            </span>
                                        ))
                                            : <p>No comments yet!</p>
                                        }
                                    </div>
                                }
                            </div>
                        ))
                        : <h1>No posts yet!</h1>
                }

            </section >
        </div>

    )
}

export default Posts