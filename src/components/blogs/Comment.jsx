import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useFlash } from "../../context/FlashContext";
import CommentCards from "./CommentCards";
import './Comments.css';

const Comment = ({ blogId }) => {
  const { user } = useContext(AuthContext);
  const { showFlash } = useFlash();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  useEffect(() => {
    if (!blogId) return;
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        showFlash("Failed to load comments", "error");
      }
    };
    fetchComments();
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/${blogId}/comments`,
        { comment: newComment },
        { withCredentials: true }
      );

      setComments((prev) => [...prev, res.data]);
      showFlash("Comment added successfully!", "success");
      setNewComment("");
    } catch (err) {
      showFlash("Failed to add comment, kindly login", "error");
    }
  };

  return (
    <section className="tp-comments">
      <div className="tp-comments__shell">
        <div className="tp-comments__composer">
          <div><p className="tp-comments__eyebrow">Join the discussion</p><h2>What do you think?</h2></div>
          <form onSubmit={handleSubmit}>
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={user ? 'Share a thoughtful response...' : 'Log in to join the conversation...'} rows="4" disabled={!user} maxLength={2000} />
            <div className="tp-comments__composer-foot"><small>{newComment.length}/2000</small><button type="submit" disabled={!user || !newComment.trim()}>Post comment</button></div>
          </form>
        </div>
        <CommentCards comments={comments} setComments={setComments} blogId={blogId} />
      </div>
    </section>
  );
};

export default Comment;
