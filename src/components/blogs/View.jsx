import React, { useState, useEffect, useContext } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useFlash } from '../../context/FlashContext';
import DOMPurify from 'dompurify';

const View = () => {
  const { user } = useContext(AuthContext);
  const { showFlash } = useFlash();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
        setBlog(res.data);
        setLikes(res.data.likes?.length || 0);
        setDislikes(res.data.dislikes?.length || 0);
      } catch (err) {
        console.error(err);
        showFlash({ type: "error", message: "Failed to load blog." });
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    if (!user) return showFlash("Please login to like the blog", "error");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${id}/like`,
        {},
        { withCredentials: true }
      );
      setLikes(res.data.likes.length);
      setDislikes(res.data.dislikes.length);
      showFlash("You liked this blog!", "success");
    } catch (err) {
      console.error(err);
      showFlash("Something went wrong while liking.", "error");
    }
  };

  const handleDislike = async () => {
    if (!user) return showFlash("Please login to dislike the blog", "error");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/blogs/${id}/dislike`,
        {},
        { withCredentials: true }
      );
      setLikes(res.data.likes.length);
      setDislikes(res.data.dislikes.length);
      showFlash("You disliked this blog!", "success");
    } catch (err) {
      console.error(err);
      showFlash("Something went wrong while disliking.", "error");
    }
  };

  const handleDelete = async () => {
    if (!user) return showFlash("Please login to delete the blog", "error");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${id}`, { withCredentials: true });
      showFlash("Blog deleted successfully!", "success");
      navigate("/");
    } catch (err) {
      console.error(err);
      showFlash("Failed to delete blog, our server are taking a deep breath", "error");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
          {/* Title & Author */}
          <div className="row align-items-start mb-4 px-2 px-sm-3 mt-4 mt-sm-5">
            <div className="col-12 col-md-8 mb-3 mb-md-0">
              <h2 className="fw-bold mb-0 fs-1 fs-sm-2 fs-md-1">{blog.heading}</h2>
            </div>
            <div className="col-12 col-md-4 text-start text-md-end">
              <div className="fw-semibold">{blog.owner?.username}</div>
              <small className="text-muted">
                Posted on {new Date(blog.date).toLocaleDateString()}
              </small>
            </div>
          </div>

          {/* Content */}
          <div className="row px-2 px-sm-3 mt-4 mt-sm-5">
            <div className="col-12">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(blog.content, {
                    ALLOWED_TAGS: [
                      'h1','h2','h3','h4','h5','h6',
                      'p','br','strong','b','em','i','u','s',
                      'ol','ul','li','blockquote','pre','code','a'
                    ],
                    ALLOWED_ATTR: ['href','target','rel'],
                    ALLOWED_URI_REGEXP: /^https?:\/\//, 
                  })
                }}
              />
            </div>
          </div>

          {/* Like/Dislike Buttons */}
          <div className="d-flex flex-column flex-sm-row justify-content-start align-items-start align-items-sm-center p-2 p-sm-3 mt-3 gap-3 gap-sm-4">
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2" onClick={handleLike}>
                <FaThumbsUp /> 
                <span>{likes}</span>
              </button>

              <button className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2" onClick={handleDislike}>
                <FaThumbsDown /> 
                <span>{dislikes}</span>
              </button>
            </div>

            {user && blog.owner?._id === user._id && (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-warning px-3 py-2" onClick={handleEdit}>
                  <span className="d-none d-sm-inline">Edit</span>
                  <span className="d-inline d-sm-none">Edit</span>
                </button>
                <button className="btn btn-danger px-3 py-2" onClick={handleDelete}>
                  <span className="d-none d-sm-inline">Delete</span>
                  <span className="d-inline d-sm-none">Del</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;