import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByPost } from "../api/api";
import CommentItem from "./CommentItem";
import CommentModal from "./CommentModal";

const CommentPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const loadComments = async () => {
    try {
      const res = await getCommentsByPost(postId);
      setComments(res.data);
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={() => window.history.back()} className="mb-4 text-blue-600 underline">
        ← Back to Post
      </button>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} refresh={loadComments} />
          ))}
        </div>
      )}

      {modalOpen && (
        <CommentModal
          postId={postId}
          onClose={() => setModalOpen(false)}
          onSuccess={loadComments}
        />
      )}
    </div>
  );
};

export default CommentPage;
