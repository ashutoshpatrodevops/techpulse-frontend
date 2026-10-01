import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import Button2 from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from 'react-bootstrap/Alert';
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import { useFlash } from "../../context/FlashContext";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showFlash } = useFlash();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    heading: "",
    genre: "",
    tags: "",
    shortDescription: "",
    content: "",
    image: null,
  });

  // 🛡️ SECURITY: Content length limits (same as create form)
  const LIMITS = {
    heading: 200,
    genre: 100,
    shortDescription: 500,
    content: 50000,
    imageSize: 5 * 1024 * 1024, // 5MB
  };

  // 🛡️ SECURITY: Allowed file types
  const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];

  // 🛡️ SECURITY: TinyMCE configuration (same as create form)
  const editorConfig = {
    height: 350,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
      'insertdatetime', 'table', 'help', 'wordcount', 'code'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | codesample | link | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    file_picker_types: '',
    images_upload_handler: () => Promise.reject("Image upload disabled for security"),
    valid_elements: 'h1,h2,h3,h4,h5,h6,p,br,strong,b,em,i,u,s,ol,ul,li,blockquote,pre,code,a[href|target|rel]',
    invalid_elements: 'script,iframe,object,embed,form,input,button',
  };

  // 🛡️ SECURITY: Input validation
  const validateInput = useCallback((name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'heading':
        if (!value.trim()) {
          newErrors.heading = 'Title is required';
        } else if (value.length > LIMITS.heading) {
          newErrors.heading = `Title must be under ${LIMITS.heading} characters`;
        } else {
          delete newErrors.heading;
        }
        break;
        
      case 'genre':
        if (!value.trim()) {
          newErrors.genre = 'Category is required';
        } else if (value.length > LIMITS.genre) {
          newErrors.genre = `Category must be under ${LIMITS.genre} characters`;
        } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
          newErrors.genre = 'Category contains invalid characters';
        } else {
          delete newErrors.genre;
        }
        break;
        
      case 'shortDescription':
        if (!value.trim()) {
          newErrors.shortDescription = 'Short description is required';
        } else if (value.length > LIMITS.shortDescription) {
          newErrors.shortDescription = `Description must be under ${LIMITS.shortDescription} characters`;
        } else {
          delete newErrors.shortDescription;
        }
        break;
        
      case 'content':
        const textContent = value.replace(/<[^>]*>/g, '').trim();
        if (!textContent) {
          newErrors.content = 'Content is required';
        } else if (value.length > LIMITS.content) {
          newErrors.content = `Content is too long (max ${LIMITS.content} characters)`;
        } else {
          delete newErrors.content;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [errors]);

  // 🛡️ SECURITY: File validation
  const validateFile = useCallback((file) => {
    const newErrors = { ...errors };
    
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        newErrors.image = 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)';
        setErrors(newErrors);
        return false;
      }
      
      if (file.size > LIMITS.imageSize) {
        newErrors.image = `Image size must be under ${LIMITS.imageSize / (1024 * 1024)}MB`;
        setErrors(newErrors);
        return false;
      }
    }
    
    delete newErrors.image;
    setErrors(newErrors);
    return true;
  }, [errors]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`, {
          withCredentials: true,
        });
        
        const blogData = {
          heading: res.data.heading || "",
          genre: res.data.genre || "",
          tags: (res.data.tags || []).join(", "),
          shortDescription: res.data.shortDescription || "",
          content: res.data.content || "",
          image: null,
        };
        
        setFormData(blogData);
        setOriginalData(blogData);
        
      } catch (err) {
        console.error("Error fetching blog:", err);
        if (err.response?.status === 404) {
          showFlash("Blog not found", "error");
          navigate("/");
        } else if (err.response?.status === 401) {
          showFlash("Please log in to edit this blog", "error");
          navigate("/login");
        } else {
          showFlash("Failed to fetch blog details", "error");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, navigate, showFlash]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    validateInput(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setFormData({ ...formData, image: file });
    }
  };

  // 🛡️ SECURITY: Handle TinyMCE content with sanitization
  const handleContentChange = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'ol', 'ul', 'li',
        'blockquote', 'pre', 'code',
        'a'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^https?:\/\//,
    });
    
    validateInput('content', sanitizedContent);
    setFormData({ ...formData, content: sanitizedContent });
  };

  // Form validation before submit
  const validateForm = () => {
    const isValid = 
      validateInput('heading', formData.heading) &&
      validateInput('genre', formData.genre) &&
      validateInput('shortDescription', formData.shortDescription) &&
      validateInput('content', formData.content);
      
    return isValid && Object.keys(errors).length === 0;
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!originalData) return false;
    return (
      formData.heading !== originalData.heading ||
      formData.genre !== originalData.genre ||
      formData.shortDescription !== originalData.shortDescription ||
      formData.content !== originalData.content ||
      formData.image !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      showFlash('Please fix the errors before submitting', 'error');
      return;
    }

    if (!hasChanges()) {
      showFlash('No changes detected', 'info');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("heading", formData.heading.trim());
    data.append("genre", formData.genre.trim());
    data.append("tags", formData.tags);
    data.append("shortDescription", formData.shortDescription.trim());
    data.append("content", formData.content);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/blogs/${id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
      
      showFlash("Blog updated successfully!", "success");
      navigate(`/blogs/${id}`);
      
    } catch (err) {
      console.error("Error updating blog:", err);
      
      if (err.response?.status === 413) {
        showFlash('File size too large. Please use a smaller image.', 'error');
      } else if (err.response?.status === 400) {
        showFlash('Invalid input. Please check your data.', 'error');
      } else if (err.response?.status === 401) {
        showFlash('Please log in to edit this blog.', 'error');
        navigate('/login');
      } else if (err.response?.status === 403) {
        showFlash('You do not have permission to edit this blog.', 'error');
      } else {
        showFlash('Failed to update blog. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid px-2 px-md-4 mt-3 py-3 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading blog details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4 mt-3 py-3 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <h3 className="mb-4 text-center text-md-start">Edit Your Blog</h3>
          
          {/* Show validation errors */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mb-4">
              <strong>Please fix the following errors:</strong>
              <ul className="mb-0 mt-2">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Show unsaved changes warning */}
          {hasChanges() && (
            <Alert variant="warning" className="mb-4">
              <strong>Unsaved Changes:</strong> You have unsaved changes that will be lost if you leave this page.
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 g-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Title Of the Article</Form.Label>
                <Form.Control 
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="Enter Title"
                  required
                  className="form-control-lg"
                  maxLength={LIMITS.heading}
                  isInvalid={!!errors.heading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.heading}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {formData.heading.length}/{LIMITS.heading} characters
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g. AI, ML, DevOps, GenAI"
                  required
                  className="form-control-lg"
                  maxLength={LIMITS.genre}
                  isInvalid={!!errors.genre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.genre}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {formData.genre.length}/{LIMITS.genre} characters
                </Form.Text>
              </Form.Group>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. ai, javascript, cloud"
                maxLength={320}
              />
              <Form.Text className="text-muted">Separate tags with commas, up to 8 tags.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Write a compelling abstract that summarizes your article"
                required
                className="form-control-lg"
                maxLength={LIMITS.shortDescription}
                isInvalid={!!errors.shortDescription}
              />
              <Form.Control.Feedback type="invalid">
                {errors.shortDescription}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.shortDescription.length}/{LIMITS.shortDescription} characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Main Content</Form.Label>
              <div style={{ border: errors.content ? '1px solid #dc3545' : '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                <Editor
                  apiKey={import.meta.env.VITE_TINY_MCE_API_KEY} // Replace with your actual API key
                  value={formData.content}
                  onEditorChange={handleContentChange}
                  init={editorConfig}
                />
              </div>
              {errors.content && (
                <div className="text-danger mt-2">{errors.content}</div>
              )}
              <Form.Text className="text-muted">
                Content length: {formData.content.replace(/<[^>]*>/g, '').length} characters
              </Form.Text>
            </Form.Group>

            <Row className="mb-4 g-3">
              <Form.Group as={Col} xs={12} md={6} controlId="formFile">
                <Form.Label>Update Cover Image (Optional)</Form.Label>
                <Form.Control 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  className="form-control-lg"
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Max size: {LIMITS.imageSize / (1024 * 1024)}MB. Formats: JPEG, PNG, WebP, GIF
                </Form.Text>
                <Form.Text className="text-muted d-block">
                  Leave empty to keep current image
                </Form.Text>
              </Form.Group>
            </Row>

            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <Button2
                variant="outlined"
                onClick={() => navigate(`/blogs/${id}`)}
                disabled={isSubmitting}
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Cancel
              </Button2>
              
              <Button2
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={isSubmitting || Object.keys(errors).length > 0 || !hasChanges()}
                size="large"
                sx={{
                  background: hasChanges() ? "linear-gradient(45deg, #8A2BE2 30%, #9370DB 90%)" : "#6c757d",
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: hasChanges() ? "linear-gradient(45deg, #7B68EE 30%, #8A2BE2 90%)" : "#5c636a",
                  }
                }}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button2>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;