import { createContext } from "react";

// create an initial state which mimics the structure of useState, values will be initialised in App.js
const PostContext = createContext([{}, () => { }])

export default PostContext






