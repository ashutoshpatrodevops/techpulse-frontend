import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const PostArticle = () => {
  return (
    <div className='container mt-5 mb-5 p-5'>
      <div className="row mt-lg-5 mt-3 justify-content-center align-items-center">
        <div className="col-lg-6 col-md-6 col-12 p-lg-4 p-md-3 p-3 text-center text-lg-start">
          <h2 className='mb-4'>Share Your Tech Journey</h2>
          <p className='fs-lg-1 fs-md-6 fs-6 text-muted mb-4'>
            Join a vibrant community of developers, engineers, and tech innovators. Share your insights, connect with like-minded professionals, and build your network in the tech industry.
          </p>
          <p className='fs-lg-5 fs-md-6 fs-6 text-muted mb-4'>
            Whether you're exploring AI breakthroughs, mastering new frameworks, or sharing career tips - your voice matters. Connect, learn, and grow with fellow tech enthusiasts.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-center justify-content-center justify-content-lg-start">
            <Link to="/create" className="text-decoration-none">
              <Button
                style={{
                  background: "blueviolet",
                  border: "none",
                  borderRadius: "50px",
                  padding: "12px 30px",
                  fontSize: "1rem",
                  fontWeight: "500"
                }}
              >
                Post Your Article
              </Button>
            </Link>
            <span className='text-muted fs-6'>
              Join 500+ tech writers in our community
            </span>
          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-12 text-center p-lg-4 p-md-3 p-3">
          <img src="/community.svg" className="img-fluid" style={{width:"80%", maxWidth:"400px"}} alt="Tech community" />
        </div>
      </div>
    </div>
  )
}

export default PostArticle