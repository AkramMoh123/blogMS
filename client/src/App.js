import React from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";


function App() {
  return (
    <div className="container">
      <h1>Create Post</h1>
      <CreatePost />
      <PostList />
    </div>
  );
}

export default App;
