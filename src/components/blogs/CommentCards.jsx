import React, { useContext } from "react";
import { FaRegComment, FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa";
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
    <div className="tp-comment-list">
      <div className="tp-comment-list__head"><h3>Community responses</h3><span><FaRegComment /> {comments?.length || 0}</span></div>
      {!comments || comments.length === 0 ? (
        <div className="tp-comment-list__empty"><FaRegComment /><p>No comments yet. Be the first to add your perspective.</p></div>
      ) : (
        comments.map((comment) => (
          <article
            key={comment._id}
            className="tp-comment-card"
          >
            <div className="tp-comment-card__top"><div className="tp-comment-card__author"><span>{comment.author?.username?.charAt(0).toUpperCase() || 'A'}</span><strong>{comment.author?.username || "Anonymous"}</strong></div><small>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}</small></div>
            <p className="tp-comment-card__body">{comment.comment}</p>
            <div className="tp-comment-card__actions">
                <button type="button" onClick={() => handleLike(comment._id)}><FaThumbsUp /> {comment.likes?.length || 0}</button>
                <button type="button" onClick={() => handleDislike(comment._id)}><FaThumbsDown /> {comment.dislikes?.length || 0}</button>
                {user && (comment.author?._id === user._id || comment.author?._id === user.id) && <button className="is-delete" type="button" onClick={() => handleDelete(comment._id)}><FaTrash /> Delete</button>}
              </div>
          </article>
        ))
      )}
    </div>
  );
};

export default CommentCards;
