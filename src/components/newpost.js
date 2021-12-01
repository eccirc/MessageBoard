import React, { useState, useContext } from 'react'
import PostContext from '../Context'

//Two URLs - one for production (url) one for development (devURL)
const url = "https://serverles-social-api.davidgw.workers.dev"
const devURL = "http://127.0.0.1:8787"

const putPost = async (content) => {
    //This triggers a function on a Cloudflare worker to add content (in this case a new post) to the KV namespace
    let response = await fetch(url,
        {
            method: "POST",
            body: JSON.stringify(content),
            headers: { "Content-type": "application/json" }
        }
    )
    return response
}
const NewPost = () => {

    const [title, setTitle] = useState("")
    const [username, setUsername] = useState("")
    const [content, setContent] = useState("")
    const [posted, setPosted] = useContext(PostContext)

    const makePost = async () => {
        //Set some new forms data and call the async function above
        let postForm = {
            title: title,
            username: username,
            date: new Date().toLocaleString(),
            id: username + String(Math.round((Date.now() * Math.random()))),
            content: content,
            reactions: [],
            comments: []
        }
        try {
            await putPost(postForm)
            setPosted({ isPosted: true })
        } catch (error) {
            alert(error.message)

        }

        setTitle("")
        setUsername("")
        setContent("")
        setPosted({ isPosted: false })


    }

    return (

        <div>
            <div>
                <button className="rounded-md p-2 my-2 bg-pink-500 text-white flex-1 h-auto" onClick={() => makePost()}
                >Submit New Post</button>
            </div>
            <form className="flex flex-col" >
                <div>
                    <input type="text" placeholder="username" className="border rounded p-2 mr-2" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                    <input type="text" placeholder="post title" className="border rounded p-2 mx-2" value={title} onChange={e => setTitle(e.target.value)}></input>
                </div>
                <textarea placeholder="post content" className="border rounded p-2 mr-2 mt-2" value={content} onChange={e => setContent(e.target.value)} ></textarea>
            </form>
        </div>


    )
}

export default NewPost