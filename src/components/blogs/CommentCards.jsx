import React, { useContext } from "react";
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CommentCards = ({ comments, setComments, blogId }) => {
  const { user } = useContext(AuthContext);
  
  // Delete a comment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments/${id}`, {
        withCredentials: true,
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Like a comment
  const handleLike = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments/${id}/like`,
        {},
        { withCredentials: true }
      );
      setComments(
        comments.map((c) => (c._id === id ? { ...c, likes: res.data.likes } : c))
      );
    } catch (err) {
      console.error("Error liking comment:", err);
    }
  };

  // Dislike a comment
  const handleDislike = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments/${id}/dislike`,
        {},
        { withCredentials: true }
      );
      setComments(
        comments.map((c) => (c._id === id ? { ...c, dislikes: res.data.dislikes } : c))
      );
    } catch (err) {
      console.error("Error disliking comment:", err);
    }
  };

  return (
    <div>
      <h3 className="mb-3">All Comments</h3>
      {!comments || comments.length === 0 ? (
        <p className="text-muted">No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment._id}
            className="p-3 mb-3 border rounded d-flex justify-content-between align-items-start"
          >
            <div>
              <h6 className="mb-1">{comment.author?.username || "Anonymous"}</h6>
              <p className="mb-2">{comment.comment}</p>
              <div className="d-flex gap-3">
                <span onClick={() => handleLike(comment._id)} style={{ cursor: "pointer" }}>
                  <FaThumbsUp className="me-1" />{comment.likes?.length || 0}
                </span>
                <span onClick={() => handleDislike(comment._id)} style={{ cursor: "pointer" }}>
                  <FaThumbsDown className="me-1" /> {comment.dislikes?.length || 0}
                </span>
              </div>
            </div>
            {user && comment.author?._id === user._id && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(comment._id)}
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentCards;
