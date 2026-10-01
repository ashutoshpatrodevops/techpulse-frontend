import React, { useState, useEffect } from 'react';
import View from './View';
import Comment from './Comment';
import CommentCards from './CommentCards';
import axios from 'axios';
import { useParams, useNavigate } from "react-router-dom";

const slugify = (value) => value
  .toString()
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/[\s-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'article';

const Compblog = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const endpoint = slug ? `/blogs/slug/${slug}` : `/blogs/${id}`;
        const res = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`);
        setBlog(res.data);
        if (id) {
          const articleSlug = res.data.slug || slugify(res.data.heading);
          navigate(`/blog/${articleSlug}`, { replace: true });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id, slug, navigate]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <View blog={blog} />
    
      <Comment blogId={blog._id} />

      
    </div>
  );
};

export default Compblog;
