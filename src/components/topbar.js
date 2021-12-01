import React from 'react'
import Qod from './qod'
import NewPost from './newpost'

const Topbar = () => {
    const title = "M£$$AGE B0A&D"
    return (
        <div>
            <header className=" p-8 flex justify-around border-2 sticky z-0 top-0 bg-pink-100">
                <div>
                    <h1 className="text-2xl">{title}</h1>
                    <Qod />
                </div>
                <NewPost />
            </header>
        </div>
    )
}

export default Topbar