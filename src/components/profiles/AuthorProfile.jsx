import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './AuthorProfile.css';

const AuthorProfile = () => {
  const { username } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${encodeURIComponent(username)}`);
        setProfile({
          ...response.data,
          blogs: Array.isArray(response.data.blogs) ? response.data.blogs : [],
          stats: response.data.stats || { articles: 0, followers: 0, following: 0 },
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Profile could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const toggleFollow = async () => {
    if (!user || !profile || busy) return;
    try {
      setBusy(true);
      const endpoint = `${import.meta.env.VITE_API_URL}/users/${profile.user._id}/follow`;
      const response = profile.isFollowing
        ? await axios.delete(endpoint, { withCredentials: true })
        : await axios.post(endpoint, {}, { withCredentials: true });
      setProfile((current) => ({
        ...current,
        isFollowing: response.data.following,
        stats: { ...current.stats, followers: response.data.followers },
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not update follow status.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <main className="tp-profile__state">Loading profile...</main>;
  if (error && !profile) return <main className="tp-profile__state tp-profile__state--error">{error}</main>;

  const isOwnProfile = user?._id === profile.user._id || user?.id === profile.user._id;
  return (
    <main className="tp-profile">
      <div className="tp-profile__shell">
        <section className="tp-profile__hero">
          <div className="tp-profile__avatar">{profile.user.avatar ? <img src={profile.user.avatar} alt="" /> : profile.user.username.charAt(0).toUpperCase()}</div>
          <div className="tp-profile__identity"><p className="tp-profile__eyebrow">TechPulse author</p><h1>{profile.user.username}</h1><p>{profile.user.bio || 'Sharing ideas, experiments, and lessons from the world of technology.'}</p></div>
          <div className="tp-profile__actions">
            {!isOwnProfile && <button className={`tp-profile__follow${profile.isFollowing ? ' is-following' : ''}`} type="button" onClick={toggleFollow} disabled={!user || busy}>{profile.isFollowing ? 'Following' : 'Follow'}</button>}
            {!user && <Link className="tp-profile__login" to="/login">Log in to follow</Link>}
          </div>
        </section>

        <section className="tp-profile__stats" aria-label="Author stats">
          <span><strong>{profile.stats.articles}</strong> articles</span>
          <span><strong>{profile.stats.followers}</strong> followers</span>
          <span><strong>{profile.stats.following}</strong> following</span>
        </section>

        <section className="tp-profile__articles">
          <div className="tp-profile__section-head"><div><p className="tp-profile__eyebrow">Published work</p><h2>Articles by {profile.user.username}</h2></div></div>
          {profile.blogs.length === 0 ? <p className="tp-profile__empty">No published articles yet.</p> : <div className="tp-profile__grid">{profile.blogs.map((blog) => <Link className="tp-profile__article" to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`} key={blog._id}><span>{blog.genre}</span><h3>{blog.heading}</h3><p>{blog.shortDescription}</p><small>{blog.likes?.length || 0} likes</small></Link>)}</div>}
        </section>
      </div>
    </main>
  );
};

export default AuthorProfile;