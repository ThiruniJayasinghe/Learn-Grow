import React, { useState, useEffect } from "react";
import { createComment, updateComment } from "../api/api";

const CommentModal = ({ comment, postId, onClose, onSuccess }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (comment) {
      setContent(comment.content);
    } else {
      setContent("");
    }
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment) {
        await updateComment(comment.id, { ...comment, content });
        alert("Comment updated successfully");
      } else {
        await createComment(postId, { content });
        alert("Comment created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert("An error occurred while submitting the comment.");
      console.error(error);
    }
  };

  return (
    <div className="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">
          {comment ? "Edit Comment" : "Add Comment"}
        </h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          placeholder="Write your comment..."
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentModal;
