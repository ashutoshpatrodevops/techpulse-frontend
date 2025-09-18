import React from 'react'
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa'

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer bg-dark text-light">
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="footer-brand">
              <h2 className="blog-name mb-3" style={{ color: 'blueviolet' }}>TechPulse</h2>
              <p className="tagline mb-4">Your daily dose of tech insights and innovation stories</p>
              <div className="social-icons d-flex gap-3 mb-4">
                <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Twitter" 
                   className="text-light" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  <FaTwitter />
                </a>
                <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                   className="text-light" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  <FaGithub />
                </a>
                <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                   className="text-light" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  <FaLinkedin />
                </a>
                <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                   className="text-light" style={{ fontSize: '1.5rem', transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  <FaInstagram />
                </a>
              </div>
              <div className="developer-info">
                <h5 className="mb-2" style={{ color: 'blueviolet' }}>Developer:</h5>
                <h4 className="mb-0">Ashutosh Patro</h4>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-4" style={{ color: 'blueviolet' }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-light text-decoration-none" 
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="/blogs" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Blogs
                </a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="mb-4" style={{ color: 'blueviolet' }}>Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/category/ai" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Artificial Intelligence
                </a>
              </li>
              <li className="mb-2">
                <a href="/category/web-dev" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Web Development
                </a>
              </li>
              <li className="mb-2">
                <a href="/category/mobile" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Mobile Apps
                </a>
              </li>
              <li className="mb-2">
                <a href="/category/blockchain" className="text-light text-decoration-none"
                   style={{ transition: 'color 0.3s' }}
                   onMouseEnter={(e) => e.target.style.color = 'blueviolet'}
                   onMouseLeave={(e) => e.target.style.color = 'white'}>
                  Blockchain
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6 col-12">
            <h5 className="mb-4" style={{ color: 'blueviolet' }}>Contact Info</h5>
            <div className="contact-info">
              <div className="d-flex align-items-center mb-3">
                <FaEnvelope className="me-3" style={{ color: 'blueviolet', fontSize: '1.2rem' }} />
                <span>ashutoshpatro9087@gmail.com</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <FaPhone className="me-3" style={{ color: 'blueviolet', fontSize: '1.2rem' }} />
                <span>+91 78478 10210</span>
              </div>
              <div className="d-flex align-items-start mb-4">
                <FaMapMarkerAlt className="me-3 mt-1" style={{ color: 'blueviolet', fontSize: '1.2rem' }} />
                <span>Berhampur<br />Ganjam,Odisha,761008</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            
          </div>
        </div>

        {/* Bottom Bar */}
        <hr className="my-4" style={{ borderColor: '#666' }} />
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 col-12 text-center text-md-start">
            <p className="mb-lg-0 mb-md-0 mb-2">
              © 2025 TechPulse. All rights reserved. | 
              <a href="/privacy" className="text-decoration-none ms-2" style={{ color: 'blueviolet' }}>
                Privacy Policy
              </a> | 
              <a href="/terms" className="text-decoration-none ms-2" style={{ color: 'blueviolet' }}>
                Terms of Service
              </a>
            </p>
          </div>
          <div className="col-lg-6 col-md-6 col-12 text-center text-md-end">
            <button 
              onClick={scrollToTop}
              className="btn btn-sm"
              style={{ 
                background: 'blueviolet', 
                border: 'none', 
                color: 'white',
                borderRadius: '50px',
                padding: '8px 15px'
              }}
              aria-label="Scroll to top"
            >
              <FaArrowUp className="me-2" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer