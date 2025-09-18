import React from 'react'
import Navbar from '../Navbar'
import Hero from './Hero'
import Content from './Content'
import Blogpage from './Blogpage'
import Footer from '../footer'
import PostArticle from './PostArticle'
const Homepage = () => {
  return (
    <>
      <Hero />
      <PostArticle/>
      <Content />
      <Blogpage/>
   </>
  )
}

export default Homepage
