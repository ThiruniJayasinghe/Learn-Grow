import React, { useState } from "react";
import { deleteComment } from "../api/api";
import CommentModal from "./CommentModal";

const CommentItem = ({ comment, refresh }) => {
  const [editMode, setEditMode] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      alert("Comment deleted successfully");
      refresh();
    } catch (err) {
      alert("Failed to delete comment.");
      console.error(err);
    }
  };

  return (
    <div className="border-b border-gray-300 py-2">
      <p>
        <strong>{comment.author}</strong>: {comment.content}
      </p>
      <div className="space-x-2 mt-1">
        <button
          onClick={() => setEditMode(true)}
          className="text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>

      {editMode && (
        <CommentModal
          comment={comment}
          postId={comment.postId}
          onClose={() => setEditMode(false)}
          onSuccess={() => {
            refresh();
            setEditMode(false);
          }}
        />
      )}
    </div>
  );
};

export default CommentItem;
