import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByPost } from "../api/api";
import CommentItem from "./CommentItem";
import CommentModal from "./CommentModal";

const CommentPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [parentId, setParentId] = useState(null);

  const loadComments = async () => {
    const res = await getCommentsByPost(postId);
    setComments(res.data);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div>
      <button onClick={() => window.history.back()}>Back to Post</button>
      <h2>Comments</h2>
      <button
        onClick={() => {
          setModalOpen(true);
          setParentId(null);
        }}
      >
        Write your comment here
      </button>
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} refresh={loadComments} />
      ))}
      {modalOpen && (
        <CommentModal
          postId={postId}
          parentId={parentId}
          onClose={() => setModalOpen(false)}
          onSuccess={loadComments}
        />
      )}
    </div>
  );
};
export default CommentPage;
