import React from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";
import './App.css'; 


function App() {
  return (
    <div className="App">
      <PostForm />
      <hr />
      <PostList/>
    </div>
  );
}

export default App;
