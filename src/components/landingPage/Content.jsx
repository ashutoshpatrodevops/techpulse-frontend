import React from 'react'

const Content = () => {
  return (
    <div className='container mt-5 p-lg-5 p-md-4 p-3'>
        <div className="row g-lg-0 g-md-3 g-4">
            <div className="services col-lg-4 col-md-6 col-12 p-lg-5 p-md-4 p-3 text-center text-lg-start">
                <img src="/Anywhere.svg" className="img-fluid mb-3" style={{width:"60%", maxWidth:"200px"}} alt="Anywhere access" />
                <p className='mt-lg-5 mt-md-4 mt-3 fs-5'> TechPulse gives you the freedom to create blogs and share your thoughts anytime, anywhere. Whether you have a quick idea or a detailed write-up, you can publish your blog instantly and even add comments on the go whenever you're free, keeping the conversation alive.</p>
            </div>
            <div className="col-lg-4 col-md-6 col-12 p-lg-5 p-md-4 p-3 text-center text-lg-start">
                 <img src="/Zone.svg" className="img-fluid mb-3" style={{width:"60%", maxWidth:"200px"}} alt="Developer zone" />
                 <p className='mt-lg-3 mt-md-4 mt-3 fs-5'> This platform is revolutionary for professional developers, offering them a dedicated space to connect with the latest trends and innovations in the tech world. From sharing insights to exploring others' work, TechPulse becomes your hub for staying ahead in a fast-changing industry.</p>
            </div>
            <div className="col-lg-4 col-md-12 col-12 p-lg-5 p-md-4 p-3 text-center text-lg-start">
                 <img src="/popular.svg" className="img-fluid mb-3" style={{width:"60%", maxWidth:"200px"}} alt="Popular technologies" />
                 <p className='mt-lg-3 mt-md-4 mt-3 fs-5'>Whether it's Artificial Intelligence, Machine Learning, Web Development, or any other emerging technology, TechPulse helps you connect with like-minded enthusiasts and experts. It's not just about information—it's about building meaningful connections across the tech community.</p>
            </div>
            
        </div>
    </div>
  )
}

export default Content