import React, { useState, useContext, useCallback } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import Button2 from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useFlash } from "../../context/FlashContext";
import { useNavigate } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react'; 
import DOMPurify from 'dompurify'; 
const CreateBlog = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showFlash } = useFlash();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    heading: "",
    category: "",
    shortDescription: "",
    content: "",
    image: null,
  });

  // 🛡️ SECURITY: Content length limits
  const LIMITS = {
    heading: 200,
    category: 100,
    shortDescription: 500,
    content: 50000, // ~50KB of HTML content
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

  // 🛡️ SECURITY: TinyMCE configuration
  const editorConfig = {
    height: 300,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'codesample', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'code'
    ],
    toolbar: 'undo redo | blocks | ' +
      'bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | codesample | link | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    // 🛡️ SECURITY: Disable file/image uploads for security
    file_picker_types: '',
    images_upload_handler: () => Promise.reject("Image upload disabled for security"),
    // 🛡️ SECURITY: Content filtering
    valid_elements: 'h1,h2,h3,h4,h5,h6,p,br,strong,b,em,i,u,s,ol,ul,li,blockquote,pre,code,a[href|target|rel]',
    invalid_elements: 'script,iframe,object,embed,form,input,button',
  };

  // 🛡️ SECURITY: Input validation function
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
        
      case 'category':
        if (!value.trim()) {
          newErrors.category = 'Category is required';
        } else if (value.length > LIMITS.category) {
          newErrors.category = `Category must be under ${LIMITS.category} characters`;
        } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
          newErrors.category = 'Category contains invalid characters';
        } else {
          delete newErrors.category;
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
        const textContent = value.replace(/<[^>]*>/g, '').trim(); // Strip HTML for length check
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
        return false;
      }
      
      if (file.size > LIMITS.imageSize) {
        newErrors.image = `Image size must be under ${LIMITS.imageSize / (1024 * 1024)}MB`;
        return false;
      }
    }
    
    delete newErrors.image;
    setErrors(newErrors);
    return true;
  }, [errors]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setFormData({ ...formData, image: files[0] });
      }
    } else {
      // 🛡️ SECURITY: Validate on change
      validateInput(name, value);
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🛡️ SECURITY: Handle rich text content with sanitization
  const handleContentChange = (content) => {
    // Client-side sanitization (backup measure)
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
        'ol', 'ul', 'li',
        'blockquote', 'pre', 'code',
        'a'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^https?:\/\//, // Only allow HTTP/HTTPS links
    });
    
    validateInput('content', sanitizedContent);
    setFormData({ ...formData, content: sanitizedContent });
  };

  // 🛡️ SECURITY: Form validation before submit
  const validateForm = () => {
    const isValid = 
      validateInput('heading', formData.heading) &&
      validateInput('category', formData.category) &&
      validateInput('shortDescription', formData.shortDescription) &&
      validateInput('content', formData.content);
      
    return isValid && Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 🛡️ SECURITY: Validate entire form before submission
    if (!validateForm()) {
      showFlash('Please fix the errors before submitting', 'error');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("heading", formData.heading.trim());
    data.append("genre", formData.category.trim());
    data.append("shortDescription", formData.shortDescription.trim());
    
    // 🛡️ SECURITY: Send sanitized content (server should sanitize again)
    data.append("content", formData.content);
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/blogs`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // 🛡️ SECURITY: Add timeout to prevent hanging requests
        timeout: 30000, // 30 seconds
      });
      
      showFlash(`Blog Created Successfully`, "success");
      setFormData({ heading: "", category: "", shortDescription: "", content: "", image: null });
      setErrors({});
      navigate("/");
      
    } catch (err) {
      console.error(err.response || err);
      
      // 🛡️ SECURITY: Don't expose sensitive error details
      if (err.response?.status === 413) {
        showFlash('File size too large. Please use a smaller image.', 'error');
      } else if (err.response?.status === 400) {
        showFlash('Invalid input. Please check your data.', 'error');
      } else if (err.response?.status === 401) {
        showFlash('Please log in to create a blog.', 'error');
        navigate('/login');
      } else {
        showFlash('Server error. Please try again later.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid px-2 px-md-4 mt-3 py-3 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <h3 className="mb-4 text-center text-md-start">Create Your New Blog</h3>
          
          {/* 🛡️ SECURITY: Show validation errors */}
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
          
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 g-3">
              <Form.Group as={Col} xs={12} md={6}>
                <Form.Label>Title Of the Article</Form.Label>
                <Form.Control
                  name="heading"
                  placeholder="Enter Title"
                  value={formData.heading}
                  onChange={handleChange}
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
                  name="category"
                  placeholder="e.g. AI, ML, DevOps, GenAI"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="form-control-lg"
                  maxLength={LIMITS.category}
                  isInvalid={!!errors.category}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  {formData.category.length}/{LIMITS.category} characters
                </Form.Text>
              </Form.Group>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="shortDescription"
                placeholder="Write a compelling abstract that summarizes your article"
                value={formData.shortDescription}
                onChange={handleChange}
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
                  apiKey={import.meta.env.VITE_TINY_MCE_API_KEY} // Get free key from tinymce.com
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
                <Form.Label>Upload Cover Image (Optional)</Form.Label>
                <Form.Control 
                  type="file" 
                  name="image" 
                  onChange={handleChange}
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
              </Form.Group>
            </Row>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions of TechPulse Article"
                required
                className="fs-6"
              />
            </Form.Group>

            <div className="d-flex justify-content-center justify-content-md-start">
              <Button2
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={isSubmitting || Object.keys(errors).length > 0}
                size="large"
                sx={{
                  background: "linear-gradient(45deg, #8A2BE2 30%, #9370DB 90%)",
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: "linear-gradient(45deg, #7B68EE 30%, #8A2BE2 90%)",
                  }
                }}
              >
                {isSubmitting ? "Publishing..." : "Publish Article"}
              </Button2>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;