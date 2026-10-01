import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useFlash } from "../../context/FlashContext";
import CommentCards from "./CommentCards";

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
    <div className="container py-4 p-5">
      <h2 className="mb-4 text-center text-md-start">Comment your views</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Textarea takes full width */}
        <div className="col-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="form-control"
            rows="3"
          />
        </div>

        {/* Button centers on mobile, aligns left on desktop */}
        <div className="col-12 d-flex justify-content-center justify-content-md-start">
  <button type="submit" className="btn custom-btn px-4 py-2 fw-semibold shadow-sm">
    Submit
  </button>
</div>
      </form>

      {/* Comments section */}
      <div className="mt-5">
        <CommentCards comments={comments} setComments={setComments} blogId={blogId} />
      </div>
    </div>
  );
};

export default Comment;
