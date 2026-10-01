import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import DashboardTabs from './DashboardTabs';
import DashboardOverview from './DashboardOverview';
import DashboardBlogs from './DashboardBlogs';
import DashboardComments from './DashboardComments';
import DashboardBookmarks from './DashboardBookmarks';
import DashboardLikes from './DashboardLikes';

const getActiveDays = (data, user) => {
  const activities = [...(data?.blogs || []), ...(data?.comments || [])];
  if (user?.createdAt) {
    return Math.max(1, Math.ceil((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)));
  }
  return new Set(activities.map((activity) => new Date(activity.createdAt).toISOString().slice(0, 10))).size;
};

export const Dashboard = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const username = user?.username;

  const fetchDashboard = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/${encodeURIComponent(username)}/dashboard`, { withCredentials: true });
      setData({
        ...response.data,
        blogs: Array.isArray(response.data.blogs) ? response.data.blogs : [],
        comments: Array.isArray(response.data.comments) ? response.data.comments : [],
        bookmarks: Array.isArray(response.data.bookmarks) ? response.data.bookmarks : [],
        likedBlogs: Array.isArray(response.data.likedBlogs) ? response.data.likedBlogs : [],
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useImperativeHandle(ref, () => ({ refresh: fetchDashboard }), [fetchDashboard]);

  const removeBookmark = async (blogId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/blogs/${blogId}/bookmark`, {}, { withCredentials: true });
      setData((current) => ({
        ...current,
        bookmarks: current.bookmarks.filter((blog) => blog._id !== blogId),
        totalBookmarks: Math.max((current.totalBookmarks || 1) - 1, 0),
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to remove saved article');
    }
  };

  if (loading) return <div className="tp-dashboard__state"><i className="fas fa-circle-notch fa-spin" aria-hidden="true" /><p>Loading your TechPulse space...</p></div>;
  if (error) return <div className="tp-dashboard__state tp-dashboard__error"><h2>We could not load your dashboard.</h2><p>{error}</p><button className="tp-action" type="button" onClick={fetchDashboard}>Try again</button></div>;
  if (!data) return <div className="tp-dashboard__state"><p>No dashboard data is available.</p><button className="tp-action" type="button" onClick={fetchDashboard}>Refresh</button></div>;

  return (
    <main className="tp-dashboard">
      <div className="tp-dashboard__shell">
        <div className="tp-dashboard__workspace">
          <DashboardTabs activeTab={activeTab} onChange={setActiveTab} data={data} />
          <div className="tp-dashboard__main">
            <DashboardHeader user={user} onRefresh={fetchDashboard} loading={loading} />
            <DashboardStats data={data} activeDays={getActiveDays(data, user)} />
            {activeTab === 'overview' && <DashboardOverview data={data} />}
            {activeTab === 'blogs' && <DashboardBlogs blogs={data.blogs || []} />}
            {activeTab === 'comments' && <DashboardComments comments={data.comments || []} />}
            {activeTab === 'bookmarks' && <DashboardBookmarks bookmarks={data.bookmarks || []} onRemove={removeBookmark} />}
            {activeTab === 'likes' && <DashboardLikes blogs={data.likedBlogs || []} />}
          </div>
        </div>
      </div>
    </main>
  );
});

Dashboard.displayName = 'Dashboard';