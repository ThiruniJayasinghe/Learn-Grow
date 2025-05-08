import React, { useState } from "react";
import axios from "axios";
import './App.css';

const UpdatePostModal = ({ post, onClose, onUpdate }) => {
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [newFiles, setNewFiles] = useState([]);
    const [deletedFiles, setDeletedFiles] = useState([]);

    const handleFileChange = (e) => {
        setNewFiles([...newFiles, ...e.target.files]);
    };

    const handleDeleteFile = (file) => {
        // Add the file to the deletedFiles array
        setDeletedFiles([...deletedFiles, file]);
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);

        // Append new files to formData
        newFiles.forEach((file) => {
            formData.append("files", file);
        });

        // Add deleted files to formData (send as JSON string)
        formData.append("deletedFiles", JSON.stringify(deletedFiles));

        try {
            await axios.put(`http://localhost:8080/api/postnew/${post.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            alert("Post updated!");
            onUpdate();
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Edit Post</h3>

                {/* Show existing files */}
                {post.fileUrls?.length > 0 && (
                    <div className="file-preview">
                        <p>Existing Files:</p>
                        {post.fileUrls.map((url, index) => (
                            <div key={index} className="file-preview-item">
                                {url.endsWith(".mp4") ? (
                                    <video src={url} controls width="200" />
                                ) : (
                                    <img src={url} alt="preview" width="200" />
                                )}
                                <button onClick={() => handleDeleteFile(url)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Title and description inputs */}
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                {/* File input for adding new files */}
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />

                {/* Update button */}
                <button onClick={handleUpdate}>Update</button>

                {/* Close button */}
                <button onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
        </div>
    );
};

export default UpdatePostModal;
