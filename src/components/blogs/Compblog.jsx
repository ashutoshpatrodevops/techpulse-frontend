import React, { useState, useEffect } from 'react';
import View from './View';
import Comment from './Comment';
import CommentCards from './CommentCards';
import axios from 'axios';
import { useParams } from "react-router-dom";

const Compblog = () => {
  const { id } = useParams(); // this is the blog ID from URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/blogs/${id}`); // use id here
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]); // use id as dependency

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <View blog={blog} />
    
      <Comment blogId={blog._id} />

      
    </div>
  );
};

export default Compblog;
