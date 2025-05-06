import React, { useState, useEffect } from "react";
import { createComment, updateComment } from "../api/api";

const CommentModal = ({ comment, postId, parentId, onClose, onSuccess }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (comment) setContent(comment.content);
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment) {
      await updateComment(comment.id, { ...comment, content });
      alert("Comment updated successfully");
    } else {
      await createComment(postId, { content, parentId });
      alert("Comment created successfully");
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};
export default CommentModal;
