import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, ButtonGroup, Chip, Box, Card, CardContent, CardMedia
} from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom";

const Blogpage = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState('grid');

  // Fetch blogs from backend
  useEffect(() => {
    axios.get("http://localhost:8080/blogs", { withCredentials: true })
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
  }, []);

  // Responsive Magazine Layout
  const MagazineLayout = () => (
    <Box>
      {blogs.map((blog, index) => (
        <Card 
          key={blog._id} 
          elevation={0}
          sx={{ 
            mb: 6, 
            borderRadius: 4, 
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            border: '1px solid #e9ecef',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid blueviolet'
            }
          }}
        >
          <Row className={`align-items-center g-0 ${index % 2 === 0 ? '' : 'flex-md-row-reverse'}`}>
            <Col xs={12} md={6}>
              <Box sx={{ position: 'relative', height: { xs: '200px', md: '300px' }, overflow: 'hidden' }}>
                {blog.image ? (
                  <CardMedia
                    component="img"
                    image={blog.image}
                    alt={blog.heading}
                    sx={{ 
                      height: '100%', 
                      width: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography variant="h4" sx={{ color: 'white', opacity: 0.7 }}>📝</Typography>
                  </Box>
                )}
                <Chip 
                  label={blog.genre} 
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16,
                    background: 'rgba(138, 43, 226, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </Box>
            </Col>
            <Col xs={12} md={6}>
              <CardContent sx={{ p: 4, height: { xs: 'auto', md: '300px' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'blueviolet', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
                
                <Link to={`/blogs/${blog._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="h5" component="h3" sx={{ 
                    mb: 3, fontWeight: 'bold', lineHeight: 1.2,
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': { background: 'linear-gradient(135deg, blueviolet 0%, #9932cc 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text' },
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}>
                    {blog.heading}
                  </Typography>
                </Link>

                <Typography variant="body1" sx={{ mb: 3, color: '#6c757d', lineHeight: 1.6, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
                  {blog.shortDescription}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, blueviolet 0%, #9932cc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {blog.owner?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#495057' }}>
                    {blog.owner?.username || 'Unknown'}
                  </Typography>
                </Box>
              </CardContent>
            </Col>
          </Row>
        </Card>
      ))}
    </Box>
  );

  // Responsive Grid Layout
  const GridLayout = () => (
    <Row className="g-4">
      {blogs.map(blog => (
        <Col key={blog._id} xs={12} sm={6} md={4}>
          <Link to={`/blogs/${blog._id}`} style={{ textDecoration: 'none' }}>
            <Card elevation={0} sx={{ 
              height: '100%', borderRadius: 3, overflow: 'hidden', background: 'white', border: '1px solid #e9ecef',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
              '&:hover': { transform: 'translateY(-12px) scale(1.02)', boxShadow: '0 25px 50px rgba(138, 43, 226, 0.15)', border: '1px solid blueviolet' }
            }}>
              <Box sx={{ position: 'relative', height: { xs: 180, md: 200 }, overflow: 'hidden' }}>
                {blog.image ? (
                  <CardMedia component="img" height="100%" image={blog.image} alt={blog.heading} sx={{ transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}/>
                ) : (
                  <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: 'white', opacity: 0.7 }}>📝</Typography>
                  </Box>
                )}
                <Chip label={blog.genre} size="small" sx={{ position: 'absolute', top: 12, left: 12, background: 'rgba(138, 43, 226, 0.9)', color: 'white', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}/>
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, rgba(0,0,0,0.1))' }}/>
              </Box>

              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2c3e50', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: { xs: '1rem', md: '1.2rem' } }}>
                  {blog.heading}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#6c757d', mb: 3, flexGrow: 1, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: { xs: '0.85rem', md: '0.95rem' } }}>
                  {blog.shortDescription}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, blueviolet 0%, #9932cc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>{blog.owner?.username?.charAt(0)?.toUpperCase() || 'U'}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 'medium', color: '#495057', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>{blog.owner?.username || 'Unknown'}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'blueviolet', fontWeight: 'bold', fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, blueviolet 0%, #9932cc 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 2, fontSize: { xs: '2rem', md: '3rem' } }}>
          Explore Trending Blogs
        </Typography>
        <Typography variant="h6" sx={{ color: '#6c757d', mb: 4, fontWeight: 'normal', fontSize: { xs: '0.9rem', md: '1.2rem' } }}>
          Discover the latest insights from our tech community
        </Typography>

        <ButtonGroup variant="outlined" sx={{ background: 'white', borderRadius: 5, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '1px solid #e9ecef', '& .MuiButton-root': { borderRadius: 5, px: 4, py: 1.5, fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'none', border: 'none', '&.MuiButton-contained': { background: 'linear-gradient(135deg, blueviolet 0%, #9932cc 100%)', color: 'white', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }, '&.MuiButton-outlined': { color: '#6c757d', '&:hover': { background: '#f8f9fa', border: 'none' } } } }}>
          <Button variant={selectedLayout === 'magazine' ? 'contained' : 'outlined'} onClick={() => setSelectedLayout('magazine')}>📰 Magazine</Button>
          <Button variant={selectedLayout === 'grid' ? 'contained' : 'outlined'} onClick={() => setSelectedLayout('grid')}>🔲 Grid</Button>
        </ButtonGroup>
      </Box>

      {selectedLayout === 'magazine' && <MagazineLayout />}
      {selectedLayout === 'grid' && <GridLayout />}
    </Container>
  );
};

export default Blogpage;
