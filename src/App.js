import Posts from './components/posts';
import Topbar from './components/topbar'
import PostContext from './Context';
import { useState } from 'react';

function App() {
  //create an initial state to keep track of whether a post has been made
  const [posted, setPosted] = useState({ isPosted: false })

  const title = "M£$$AGE B0A&D"

  return (
    <div className="font-mono text-gray-700 w-full">
      <PostContext.Provider value={[posted, setPosted]}>
        <Topbar />
        <Posts />
      </PostContext.Provider>
    </div >
  );
}

export default App;
