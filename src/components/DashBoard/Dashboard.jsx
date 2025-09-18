import React, { useEffect, useState, useContext, useCallback, useImperativeHandle, forwardRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
export const Dashboard = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 🔄 Enhanced refetch logic with error handling
  const fetchDashboard = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `http://localhost:8080/users/${user._id}/dashboard`,
        { withCredentials: true }
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) fetchDashboard();
  }, [user, fetchDashboard]);

  useImperativeHandle(ref, () => ({
    refresh: fetchDashboard,
  }));

  // 🎯 Helper functions
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 📅 Calculate Active Days - Multiple approaches
  const calculateActiveDays = () => {
    if (!data || (!data.blogs?.length && !data.comments?.length)) return 0;

    // Method 1: Days since account creation (if you have user.createdAt)
    if (user?.createdAt) {
      const accountCreated = new Date(user.createdAt);
      const today = new Date();
      return Math.ceil((today - accountCreated) / (1000 * 60 * 60 * 24));
    }

    // Method 2: Days since first activity (blog or comment)
    const allActivities = [
      ...(data.blogs || []),
      ...(data.comments || [])
    ];

    if (allActivities.length === 0) return 0;

    const firstActivity = allActivities.reduce((earliest, activity) => {
      const activityDate = new Date(activity.createdAt);
      return !earliest || activityDate < earliest ? activityDate : earliest;
    }, null);

    if (!firstActivity) return 0;

    const today = new Date();
    return Math.ceil((today - firstActivity) / (1000 * 60 * 60 * 24));
  };

  // 📅 Alternative: Calculate Unique Active Days (more accurate)
  const calculateUniqueActiveDays = () => {
    if (!data || (!data.blogs?.length && !data.comments?.length)) return 0;

    const allActivities = [
      ...(data.blogs || []),
      ...(data.comments || [])
    ];

    // Get unique dates (just the date part, not time)
    const uniqueDates = new Set();
    
    allActivities.forEach(activity => {
      const date = new Date(activity.createdAt);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      uniqueDates.add(dateString);
    });

    return uniqueDates.size;
  };

  const getRecentBlogs = () => data?.blogs?.slice(0, 5) || [];
  const getRecentComments = () => data?.comments?.slice(0, 5) || [];

  // 🎨 Enhanced Loading State
  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🚨 Error State
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Oops! Something went wrong</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={fetchDashboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-info">
          <h4>No data available</h4>
          <p>We couldn't find any data for your dashboard.</p>
          <button className="btn btn-primary" onClick={fetchDashboard}>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-5 px-md-5 mt-5 mt-md-5">
      {/* 👋 Header Section */}
      <div className="row mb-3 mb-md-4 p-5 mt-5">
        <div className="col-12">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <div>
              <h1 className="h3 h2-md mb-1">Welcome back, {user?.username}!</h1>
              <p className="text-muted mb-0 small">Here's what's happening with your blog</p>
            </div>
            <button 
              className="btn btn-outline-primary btn-sm align-self-start align-self-sm-center"
              onClick={fetchDashboard}
              disabled={loading}
            >
              <i className="fas fa-sync-alt me-2"></i>
              <span className="d-none d-sm-inline">Refresh</span>
              <span className="d-inline d-sm-none">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div className="row mb-4 mb-md-5 g-3 g-md-4">
        <div className="col-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="text-primary mb-2">
                <i className="fas fa-blog fa-lg fa-md-2x"></i>
              </div>
              <h3 className="text-primary mb-1 fs-5 fs-md-3">{data.totalBlogs}</h3>
              <p className="text-muted mb-0 small">Total Blogs</p>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="text-success mb-2">
                <i className="fas fa-comments fa-lg fa-md-2x"></i>
              </div>
              <h3 className="text-success mb-1 fs-5 fs-md-3">{data.totalComments}</h3>
              <p className="text-muted mb-0 small">Comments</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="text-info mb-2">
                <i className="fas fa-eye fa-lg fa-md-2x"></i>
              </div>
              <h3 className="text-info mb-1 fs-5 fs-md-3">{data.totalViews || 0}</h3>
              <p className="text-muted mb-0 small">Total Views</p>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-3">
              <div className="text-warning mb-2">
                <i className="fas fa-calendar-alt fa-lg fa-md-2x"></i>
              </div>
              <h3 className="text-warning mb-1 fs-5 fs-md-3">
                {calculateActiveDays()}
              </h3>
              <p className="text-muted mb-0 small">Days Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🗂️ Tab Navigation */}
      <div className="mb-4">
        <ul className="nav nav-pills flex-column flex-sm-row" role="tablist">
          <li className="nav-item mb-2 mb-sm-0" role="presentation">
            <button 
              className={`nav-link w-100 ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <i className="fas fa-chart-line me-2"></i>
              <span className="d-none d-sm-inline">Overview</span>
              <span className="d-inline d-sm-none">Overview</span>
            </button>
          </li>
          <li className="nav-item mb-2 mb-sm-0" role="presentation">
            <button 
              className={`nav-link w-100 ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <i className="fas fa-blog me-2"></i>
              <span className="d-none d-sm-inline">My Blogs ({data.blogs?.length || 0})</span>
              <span className="d-inline d-sm-none">Blogs ({data.blogs?.length || 0})</span>
            </button>
          </li>
          <li className="nav-item mb-2 mb-sm-0" role="presentation">
            <button 
              className={`nav-link w-100 ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <i className="fas fa-comments me-2"></i>
              <span className="d-none d-sm-inline">My Comments ({data.comments?.length || 0})</span>
              <span className="d-inline d-sm-none">Comments ({data.comments?.length || 0})</span>
            </button>
          </li>
        </ul>
      </div>

      {/* 📋 Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row g-3 g-md-4">
            {/* Recent Blogs */}
            <div className="col-12 col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pb-0">
                  <h5 className="mb-0 fs-6 fs-md-5">
                    <i className="fas fa-blog text-primary me-2"></i>
                    Recent Blogs
                  </h5>
                </div>
                <div className="card-body">
                  {getRecentBlogs().length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-pen-alt fa-2x fa-md-3x text-muted mb-3"></i>
                      <p className="text-muted small">No blogs yet. Start writing your first blog!</p>
                      <button className="btn btn-primary btn-sm">
                        <i className="fas fa-plus me-2"></i>
                        Create Blog
                      </button>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {getRecentBlogs().map((blog) => (
                        <div key={blog._id} className="list-group-item px-0 border-0 py-2">
                          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                            <div className="flex-grow-1 min-width-0">
                              <h6 className="mb-1 text-truncate small">{blog.heading}</h6>
                              <small className="text-muted d-block">
                                <i className="fas fa-calendar me-1"></i>
                                {formatDate(blog.createdAt)}
                              </small>
                            </div>
                            <span className="badge bg-light text-dark flex-shrink-0">
                              {blog.comments?.length || 0} 💬
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Comments */}
            <div className="col-12 col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 pb-0">
                  <h5 className="mb-0 fs-6 fs-md-5">
                    <i className="fas fa-comments text-success me-2"></i>
                    Recent Comments
                  </h5>
                </div>
                <div className="card-body">
                  {getRecentComments().length === 0 ? (
                    <div className="text-center py-4">
                      <i className="fas fa-comment-slash fa-2x fa-md-3x text-muted mb-3"></i>
                      <p className="text-muted small">No comments yet. Start engaging with blogs!</p>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {getRecentComments().map((comment) => (
                        <div key={comment._id} className="list-group-item px-0 border-0 py-2">
                          <p className="mb-2 small">{truncateText(comment.comment)}</p>
                          <small className="text-muted">
                            <i className="fas fa-blog me-1"></i>
                            <span className="d-inline d-sm-none">On: </span>
                            <span className="d-none d-sm-inline">On: </span>
                            <strong className="text-truncate d-inline-block" style={{maxWidth: '150px'}}>
                              {comment.blog?.heading || 'Unknown blog'}
                            </strong>
                            <br />
                            <i className="fas fa-clock me-1"></i>
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
              <h5 className="mb-0 fs-6 fs-md-5">
                <i className="fas fa-blog text-primary me-2"></i>
                All Your Blogs
              </h5>
              <button className="btn btn-primary btn-sm">
                <i className="fas fa-plus me-2"></i>
                <span className="d-none d-sm-inline">New Blog</span>
                <span className="d-inline d-sm-none">New</span>
              </button>
            </div>
            <div className="card-body p-0">
              {data.blogs?.length === 0 ? (
                <div className="text-center py-5 px-3">
                  <i className="fas fa-pen-alt fa-3x fa-md-4x text-muted mb-4"></i>
                  <h4 className="text-muted fs-5 fs-md-4">No blogs yet</h4>
                  <p className="text-muted mb-4 small">Share your thoughts with the world!</p>
                  <button className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>
                    Write Your First Blog
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="table-responsive d-none d-md-block">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Comments</th>
                          <th>Likes</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.blogs.map((blog) => (
                          <tr key={blog._id}>
                            <td>
                              <div>
                                <h6 className="mb-1">{blog.heading}</h6>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success">
                                {blog.comments?.length || 0}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-info">
                                {blog.likes?.length || 0}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatDate(blog.createdAt)}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/blogs/${blog._id}`} 
                                  className="btn btn-outline-primary"
                                >
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <Link 
                                  to={`/edit/${blog._id}`} 
                                  className="btn btn-outline-secondary"
                                >
                                  <i className="fas fa-edit"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="d-md-none p-3">
                    {data.blogs.map((blog) => (
                      <div key={blog._id} className="card mb-3 border-start border-primary border-3">
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-1 flex-grow-1 text-truncate me-2">
                              {blog.heading}
                            </h6>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex gap-2">
                              <span className="badge bg-success small">
                                {blog.comments?.length || 0} comments
                              </span>
                              <span className="badge bg-info small">
                                {blog.likes?.length || 0} likes
                              </span>
                            </div>
                            <small className="text-muted">
                              {formatDate(blog.createdAt)}
                            </small>
                          </div>
                          
                          <div className="d-flex gap-2">
                            <Link 
                              to={`/blogs/${blog._id}`} 
                              className="btn btn-outline-primary btn-sm flex-fill"
                            >
                              <i className="fas fa-eye me-2"></i>View
                            </Link>
                            <Link 
                              to={`/edit/${blog._id}`} 
                              className="btn btn-outline-secondary btn-sm flex-fill"
                            >
                              <i className="fas fa-edit me-2"></i>Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0 fs-6 fs-md-5">
                <i className="fas fa-comments text-success me-2"></i>
                All Your Comments
              </h5>
            </div>
            <div className="card-body">
              {data.comments?.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-comment-slash fa-3x fa-md-4x text-muted mb-4"></i>
                  <h4 className="text-muted fs-5 fs-md-4">No comments yet</h4>
                  <p className="text-muted small">Start engaging with blog posts!</p>
                </div>
              ) : (
                <div className="row g-3">
                  {data.comments.map((comment) => (
                    <div key={comment._id} className="col-12 col-lg-6">
                      <div className="card border-start border-success border-3 h-100">
                        <div className="card-body p-3">
                          <p className="card-text small mb-3">{comment.comment}</p>
                          <div className="mt-auto">
                            <small className="text-muted">
                              <i className="fas fa-blog me-1"></i>
                              <strong className="text-truncate d-inline-block" style={{maxWidth: '200px'}}>
                                {comment.blog?.heading || 'Unknown blog'}
                              </strong>
                              <br />
                              <i className="fas fa-clock me-1"></i>
                              {formatDate(comment.createdAt)}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';