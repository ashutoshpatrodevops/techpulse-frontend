import React, { useState, useRef } from 'react';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import emailjs from '@emailjs/browser'; // Install: npm install @emailjs/browser

const Hero = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef();

  // 🔧 EmailJS Configuration
  const EMAILJS_CONFIG = {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,      
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,      
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY    
  };

  // 📧 Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 📨 Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setSubscriptionStatus(null);
    setErrorMessage('');

    // Validate email
    if (!email.trim()) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // 📧 EmailJS template parameters
      const templateParams = {
        user_email: email,
        user_name: email.split('@')[0], // Extract name from email (before @)
        subscription_date: new Date().toLocaleDateString(),
        subscription_time: new Date().toLocaleTimeString(),
        message: `New newsletter subscription from ${email}`,
        to_name: 'TechPulse Team',
        from_name: 'TechPulse Newsletter System'
      };

      // 🚀 Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('EmailJS Response:', response);

      if (response.status === 200) {
        setSubscriptionStatus('success');
        setEmail(''); // Clear the input
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubscriptionStatus(null);
        }, 5000);
      } else {
        throw new Error('Failed to send email');
      }

    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubscriptionStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mt-5 mb-5'>
      <div className="row mt-lg-5 mt-3 justify-content-center align-items-center">
        <div className="col-lg-6 col-md-6 col-12 mt-lg-4 mt-md-3 mt-2 p-lg-4 p-md-3 p-3 text-center text-lg-start">
          <h1 className='hero-title mb-4'>TechPulse</h1>
          <p className='fs-lg-4 fs-md-5 fs-6 text-muted mb-4'>
            From artificial intelligence and GenAI to software development and future tech, 
            we pulse with the stories that matter. Stay ahead, stay inspired, and explore 
            the ideas shaping tomorrow.
          </p>
          <h3 className='fs-lg-4 fs-md-5 fs-6 text-muted mb-3'>
            Subscribe to Our Newsletter Now
          </h3>

          {/* 📧 Newsletter Subscription Form */}
          <div className="newsletter-container">
            <form ref={formRef} onSubmit={handleSubscribe}>
              <TextField
                id="newsletter-email"
                label="Enter your email address"
                variant="outlined"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                error={subscriptionStatus === 'error'}
                helperText={subscriptionStatus === 'error' ? errorMessage : ''}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 50,
                    fontSize: "1rem"
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.9rem"
                  },
                  "& .MuiOutlinedInput-root": {
                    '&.Mui-focused fieldset': {
                      borderColor: subscriptionStatus === 'success' ? '#28a745' : '#8A2BE2',
                    },
                  },
                }}
              />
              
              <div className="d-flex flex-column flex-sm-row gap-3 mt-3 align-items-center justify-content-center justify-content-lg-start">
                <Button
                  type="submit"
                  className="sendButton"
                  disabled={isSubmitting || !email.trim()}
                  style={{
                    background: isSubmitting ? "#6c757d" : 
                              subscriptionStatus === 'success' ? "#28a745" : "blueviolet",
                    color: "white",
                    height: "50px",
                    fontSize: "1rem",
                    borderRadius: "50px",
                    padding: "0 20px",
                    minWidth: "130px",
                    transition: "all 0.3s ease"
                  }}
                  endIcon={
                    isSubmitting ? (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : subscriptionStatus === 'success' ? (
                      <CheckCircleIcon />
                    ) : (
                      <SendIcon />
                    )
                  }
                >
                  {isSubmitting ? "Subscribing..." : 
                   subscriptionStatus === 'success' ? "Subscribed!" : "Subscribe"}
                </Button>
              </div>
            </form>

            {/* 🎉 Success/Error Messages */}
            {subscriptionStatus === 'success' && (
              <Alert variant="success" className="mt-3 text-center">
                <CheckCircleIcon className="me-2" />
                <strong>Welcome to TechPulse!</strong> 
                <br />
                You've successfully subscribed to our newsletter. 
                Get ready for the latest tech insights!
              </Alert>
            )}

            {subscriptionStatus === 'error' && errorMessage && (
              <Alert variant="danger" className="mt-3 text-center">
                <strong>Oops!</strong> {errorMessage}
              </Alert>
            )}

            {/* 📝 Privacy Notice */}
            <p className="text-muted mt-3" style={{ fontSize: '0.85rem' }}>
              By subscribing, you agree to receive our weekly tech updates. 
              <br />
            </p>
          </div>
        </div>
        
        {/* 3D Animation Section (commented out) */}
        {/* <div className="col-lg-6 col-md-6 col-12 right d-none d-md-block text-center p-lg-4 p-md-3 p-3">
          <spline-viewer 
            id="threeD" 
            url="https://prod.spline.design/nDEfauaOM7PPE5yz/scene.splinecode" 
            loading="lazy"
            style={{width: "100%", height: "400px"}}
          >
          </spline-viewer>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;