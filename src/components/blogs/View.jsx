import { useContext, useEffect, useState } from 'react';
import { FaArrowLeft, FaEdit, FaHeart, FaRegHeart, FaThumbsDown, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AuthContext } from '../../context/AuthContext';
import { useFlash } from '../../context/FlashContext';
import './View.css';

const formatDate = (value) => new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const View = ({ blog: initialBlog }) => {
  const { user } = useContext(AuthContext);
  const { showFlash } = useFlash();
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(initialBlog || null);
  const [likes, setLikes] = useState(initialBlog?.likes?.length || 0);
  const [dislikes, setDislikes] = useState(initialBlog?.dislikes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [reactionPending, setReactionPending] = useState(false);

  const syncReactionState = (article) => {
    const userId = user?._id || user?.id;
    setLikes(article.likes?.length || 0);
    setDislikes(article.dislikes?.length || 0);
    setLiked(Boolean(userId && article.likes?.some((like) => like.toString() === userId.toString())));
    setDisliked(Boolean(userId && article.dislikes?.some((dislike) => dislike.toString() === userId.toString())));
  };

  useEffect(() => {
    if (initialBlog) {
      setBlog(initialBlog);
      syncReactionState(initialBlog);
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/blogs/${id}`);
        setBlog(response.data);
        syncReactionState(response.data);
      } catch (err) {
        console.error(err);
        showFlash('Failed to load article.', 'error');
      }
    };
    fetchBlog();
  }, [id, initialBlog, user]);

  const react = async (type) => {
    if (!user) return showFlash('Please log in to react to an article.', 'error');
    if (!blog || reactionPending) return;
    if (blog.owner?._id?.toString() === (user._id || user.id)?.toString()) {
      return showFlash('Authors cannot react to their own articles.', 'error');
    }

    const previous = { likes, dislikes, liked, disliked };
    const nextActive = type === 'like' ? !liked : !disliked;
    setReactionPending(true);
    if (type === 'like') {
      setLiked(nextActive);
      setLikes((count) => Math.max(0, count + (nextActive ? 1 : -1)));
      if (nextActive && disliked) { setDisliked(false); setDislikes((count) => Math.max(0, count - 1)); }
    } else {
      setDisliked(nextActive);
      setDislikes((count) => Math.max(0, count + (nextActive ? 1 : -1)));
      if (nextActive && liked) { setLiked(false); setLikes((count) => Math.max(0, count - 1)); }
    }

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/blogs/${blog._id}/${type}`, {}, { withCredentials: true });
      syncReactionState(response.data);
    } catch (err) {
      setLikes(previous.likes); setDislikes(previous.dislikes); setLiked(previous.liked); setDisliked(previous.disliked);
      showFlash(err.response?.data?.error || 'Could not update your reaction.', 'error');
    } finally {
      setReactionPending(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/blogs/${blog._id}`, { withCredentials: true });
      showFlash('Article deleted successfully.', 'success');
      navigate('/blogs');
    } catch (err) {
      showFlash('Failed to delete the article.', 'error');
    }
  };

  if (!blog) return <main className="tp-reader__state">Loading article...</main>;
  const isOwner = user && blog.owner?._id?.toString() === (user._id || user.id)?.toString();

  return (
    <main className="tp-reader">
      <div className="tp-reader__shell">
        <Link className="tp-reader__back" to="/blogs"><FaArrowLeft aria-hidden="true" /> Back to articles</Link>
        <article>
          <header className="tp-reader__hero">
            <div className="tp-reader__eyebrow"><span>{blog.genre}</span>{blog.tags?.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>
            <h1>{blog.heading}</h1>
            <p className="tp-reader__description">{blog.shortDescription}</p>
            <div className="tp-reader__byline">
              <span className="tp-reader__avatar">{blog.owner?.username?.charAt(0).toUpperCase() || 'T'}</span>
              <div><Link to={`/profile/${encodeURIComponent(blog.owner?.username || '')}`}>{blog.owner?.username || 'TechPulse author'}</Link><small>Published {formatDate(blog.date)}</small></div>
            </div>
          </header>

          {blog.image && <img className="tp-reader__cover" src={blog.image} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}

          <div className="tp-reader__layout">
            <div className="tp-reader__content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content, { ALLOWED_TAGS: ['h1','h2','h3','h4','h5','h6','p','br','strong','b','em','i','u','s','ol','ul','li','blockquote','pre','code','a'], ALLOWED_ATTR: ['href','target','rel'], ALLOWED_URI_REGEXP: /^https?:\/\// }) }} />
            <aside className="tp-reader__rail">
              <div className="tp-reader__reactions" aria-label="Article reactions">
                <button className={liked ? 'is-active' : ''} type="button" onClick={() => react('like')} disabled={reactionPending || Boolean(isOwner)} title={isOwner ? 'Authors cannot react to their own articles' : 'Like article'}>{liked ? <FaHeart /> : <FaRegHeart />}<span>{likes}</span></button>
                <button className={disliked ? 'is-active is-negative' : ''} type="button" onClick={() => react('dislike')} disabled={reactionPending || Boolean(isOwner)} title={isOwner ? 'Authors cannot react to their own articles' : 'Dislike article'}><FaThumbsDown /><span>{dislikes}</span></button>
              </div>
              {isOwner && <div className="tp-reader__owner-actions"><Link to={`/edit/${blog._id}`}><FaEdit /> Edit</Link><button type="button" onClick={handleDelete}><FaTrash /> Delete</button></div>}
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
};

export default View;