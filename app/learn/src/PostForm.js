import React, { useState } from "react";
import axios from "axios";
import './App.css';  // Import the CSS

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert("You can only upload up to 3 files");
      return;
    }
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("http://localhost:8080/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", response.data);
      alert("Post created successfully!");
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="post-form">
      <h2>Create a Post</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <br />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      ></textarea>
      <br />

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.mp4"
        multiple
        onChange={handleFileChange}
      />
      <p>Max 3 files. Accepted: JPG, PNG, MP4</p>

      <button type="submit">Create Post</button>
    </form>
  );
};

export default PostForm;
