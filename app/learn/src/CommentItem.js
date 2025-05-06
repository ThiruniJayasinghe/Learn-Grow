import React, { useState } from "react";
import { deleteComment } from "../api/api";
import CommentModal from "./CommentModal";

const CommentItem = ({ comment, refresh }) => {
  const [editMode, setEditMode] = useState(false);
  const [replyMode, setReplyMode] = useState(false);

  const handleDelete = async () => {
    await deleteComment(comment.id);
    alert("Comment deleted successfully");
    refresh();
  };

  return (
    <div
      style={{
        marginLeft: comment.parent ? 20 : 0,
        borderLeft: "1px solid #ccc",
        paddingLeft: 10,
      }}
    >
      <p>
        <strong>{comment.author}</strong>: {comment.content}
      </p>
      <button onClick={() => setReplyMode(true)}>Reply</button>
      <button onClick={() => setEditMode(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>

      {comment.replies &&
        comment.replies.map((child) => (
          <CommentItem key={child.id} comment={child} refresh={refresh} />
        ))}

      {editMode && (
        <CommentModal
          comment={comment}
          onClose={() => setEditMode(false)}
          onSuccess={() => {
            refresh();
            setEditMode(false);
          }}
        />
      )}

      {replyMode && (
        <CommentModal
          parentId={comment.id}
          postId={comment.postId}
          onClose={() => setReplyMode(false)}
          onSuccess={() => {
            refresh();
            setReplyMode(false);
          }}
        />
      )}
    </div>
  );
};
export default CommentItem;
