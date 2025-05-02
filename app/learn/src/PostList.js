import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import UpdatePostModal from "./UpdatePostModal";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts");

      // Map filePaths to full fileUrls
      const updatedPosts = response.data.map((post) => ({
        ...post,
        fileUrls: post.filePaths?.map(
          (file) => `http://localhost:8080/uploads/${file}`
        ),
      }));

      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/${id}`);
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="post-list">
      <h2>All Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.description}</p>

          {post.fileUrls?.length > 0 && (
            <div className="file-preview">
              {post.fileUrls.map((url, index) =>
                url.endsWith(".mp4") ? (
                  <video key={index} src={url} controls width="200" />
                ) : (
                  <img key={index} src={url} alt="preview" width="200" />
                )
              )}
            </div>
          )}

          <button onClick={() => setEditingPost(post)}>Edit</button>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}

      {editingPost && (
        <UpdatePostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={() => {
            fetchPosts();
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
};

export default PostList;
