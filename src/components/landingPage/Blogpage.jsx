import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const styles = `
.tp-blogs{max-width:1120px;margin:0 auto;padding:clamp(2rem,5vw,3.5rem) 1.25rem 4rem;font-family:'IBM Plex Sans',system-ui,sans-serif;color:#14161f}
.tp-blogs__head{text-align:center;margin-bottom:2rem}
.tp-blogs__title{margin:0 0 .6rem;font-family:'Bricolage Grotesque','IBM Plex Sans',sans-serif;font-size:clamp(2rem,5vw,3.25rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
.tp-blogs__sub{margin:0 0 1.5rem;color:#5b6275;font-size:1.1rem}
.tp-filters{display:grid;grid-template-columns:minmax(220px,2fr) repeat(3,minmax(130px,1fr));gap:.65rem;margin:0 auto 1.75rem;max-width:920px;text-align:left}
.tp-filters input,.tp-filters select{width:100%;padding:.65rem .75rem;border:1px solid #dcd4f0;border-radius:8px;background:#fff;color:#14161f;font:inherit}
.tp-filters input:focus,.tp-filters select:focus{outline:2px solid #7c3aed;outline-offset:1px}
.tp-card__tags{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.25rem}
.tp-card__tag--small{padding:.2rem .5rem;background:#f4f0fc;border-radius:999px;color:#5b6275;font-size:.75rem}
.tp-toggle{display:inline-flex;padding:.25rem;background:#f4f0fc;border:1px solid #dcd4f0;border-radius:999px}
.tp-toggle button{padding:.45rem 1.2rem;background:none;border:0;border-radius:999px;color:#5b6275;font:inherit;font-weight:500;cursor:pointer}
.tp-toggle button[aria-pressed='true']{background:#7c3aed;color:#fff}
.tp-toggle button:focus-visible,.tp-card__title a:focus-visible{outline:2px solid #7c3aed;outline-offset:3px}
.tp-blogs__list{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
.tp-blogs__list.is-grid{grid-template-columns:repeat(auto-fill,minmax(290px,1fr))}
.tp-card{position:relative;display:flex;flex-direction:column;height:100%;background:#fff;border:1px solid #e4e6ef;border-radius:16px;overflow:hidden;transition:border-color .2s,box-shadow .2s}
.tp-card:hover,.tp-card:focus-within{border-color:#7c3aed;box-shadow:0 12px 30px -12px rgba(124,58,237,.3)}
.tp-card__media{aspect-ratio:16/10;background:#f4f0fc}
.tp-card__media img{display:block;width:100%;height:100%;object-fit:cover}
.tp-card__body{position:relative;display:flex;flex:1;flex-direction:column;gap:.5rem;padding:1.25rem}
.tp-card__bookmark{position:relative;z-index:1;align-self:flex-end;margin:-.25rem -.25rem -.25rem auto;padding:.35rem .65rem;border:1px solid #dcd4f0;border-radius:999px;background:#fff;color:#5b6275;font:inherit;font-size:.8rem;cursor:pointer}
.tp-card__bookmark:hover,.tp-card__bookmark.is-saved{border-color:#7c3aed;background:#f4f0fc;color:#7c3aed}
.tp-card__bookmark:disabled{cursor:not-allowed;opacity:.55}
.tp-card__tag{color:#7c3aed;font-size:.85rem;font-weight:500}
.tp-card__title{margin:0;font-family:'Bricolage Grotesque','IBM Plex Sans',sans-serif;font-size:1.3rem;font-weight:600;line-height:1.25;letter-spacing:-.015em}
.tp-card__title a{color:inherit;text-decoration:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tp-card__title a::after{content:'';position:absolute;inset:0}
.tp-card__desc{flex:1;margin:0;color:#5b6275;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.tp-card__foot{display:flex;align-items:center;justify-content:space-between;gap:.75rem;margin-top:.5rem;font-size:.85rem;color:#5b6275}
.tp-card__by{display:flex;align-items:center;gap:.5rem;min-width:0}
.tp-card__author-link{position:relative;z-index:1;color:inherit;text-decoration:none}
.tp-card__author-link:hover{color:#7c3aed;text-decoration:underline}
.tp-card__avatar{display:grid;place-items:center;flex:none;width:26px;height:26px;background:#7c3aed;color:#fff;border-radius:50%;font-size:.75rem;font-weight:600}
.tp-blogs__list.is-list .tp-card{flex-direction:row}
.tp-blogs__list.is-list .tp-card__media{flex:0 0 min(38%,340px);aspect-ratio:auto;min-height:200px}
.tp-blogs__list.is-list .tp-card__title{font-size:1.6rem}
.tp-blogs__msg{padding:3rem 0;text-align:center;color:#5b6275}
@media(max-width:760px){.tp-filters{grid-template-columns:1fr 1fr}.tp-filters input{grid-column:1/-1}}
@media(max-width:640px){.tp-blogs__list.is-list .tp-card{flex-direction:column}.tp-blogs__list.is-list .tp-card__media{flex:none;aspect-ratio:16/10;min-height:0}.tp-filters{grid-template-columns:1fr}}
`;

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

const Blogpage = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [layout, setLayout] = useState('grid'); // grid | list
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [filters, setFilters] = useState({ q: '', genre: '', tag: '', sort: 'latest' });
  const [bookmarked, setBookmarked] = useState({});

  // Fetch blogs from backend
  useEffect(() => {
    axios
      .get(`${API}/blogs?${new URLSearchParams(Object.entries(filters).filter(([, value]) => value))}`, { withCredentials: true })
      .then((res) => {
        const articles = Array.isArray(res.data) ? res.data : res.data?.blogs;
        setBlogs(Array.isArray(articles) ? articles : []);
        setStatus('ready');
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
      });
  }, [filters]);

  const updateFilter = (name, value) => {
    setStatus('loading');
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const toggleBookmark = async (blogId) => {
    if (!user) return;

    try {
      const response = await axios.put(`${API}/blogs/${blogId}/bookmark`, {}, { withCredentials: true });
      setBookmarked((current) => ({ ...current, [blogId]: response.data.bookmarked }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="tp-blogs">
      <style>{styles}</style>

      <header className="tp-blogs__head">
        <h1 className="tp-blogs__title">Explore trending blogs</h1>
        <p className="tp-blogs__sub">Discover the latest insights from our tech community</p>
        <div className="tp-filters" role="search" aria-label="Filter articles">
          <input
            type="search"
            placeholder="Search articles"
            aria-label="Search articles"
            value={filters.q}
            onChange={(event) => updateFilter('q', event.target.value)}
          />
          <input
            type="text"
            placeholder="Genre"
            aria-label="Filter by genre"
            value={filters.genre}
            onChange={(event) => updateFilter('genre', event.target.value)}
          />
          <input
            type="text"
            placeholder="Tag"
            aria-label="Filter by tag"
            value={filters.tag}
            onChange={(event) => updateFilter('tag', event.target.value)}
          />
          <select aria-label="Sort articles" value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="latest">Latest</option>
            <option value="popular">Most liked</option>
          </select>
        </div>
        <div className="tp-toggle" role="group" aria-label="Layout">
          <button type="button" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')}>
            Grid
          </button>
          <button type="button" aria-pressed={layout === 'list'} onClick={() => setLayout('list')}>
            List
          </button>
        </div>
      </header>

      {status === 'loading' && <p className="tp-blogs__msg">Loading articles…</p>}
      {status === 'error' && (
        <p className="tp-blogs__msg" role="alert">
          We couldn&rsquo;t load the articles. Please try again later.
        </p>
      )}
      {status === 'ready' && blogs.length === 0 && <p className="tp-blogs__msg">No articles yet.</p>}

      {status === 'ready' && blogs.length > 0 && (
        <ul className={`tp-blogs__list is-${layout}`}>
          {blogs.map((blog) => {
            const author = blog.owner?.username || 'Unknown';
            return (
              <li key={blog._id}>
                <article className="tp-card">
                  <div className="tp-card__media">
                    {blog.image && <img src={blog.image} alt="" loading="lazy" />}
                  </div>
                  <div className="tp-card__body">
                    <button
                      type="button"
                      className={`tp-card__bookmark${bookmarked[blog._id] ? ' is-saved' : ''}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleBookmark(blog._id);
                      }}
                      disabled={!user}
                      title={user ? 'Save article' : 'Log in to save articles'}
                      aria-pressed={Boolean(bookmarked[blog._id])}
                    >
                      {bookmarked[blog._id] ? 'Saved' : 'Save'}
                    </button>
                    {blog.genre && <span className="tp-card__tag">{blog.genre}</span>}
                    {blog.tags?.length > 0 && (
                      <div className="tp-card__tags" aria-label="Article tags">
                        {(Array.isArray(blog.tags) ? blog.tags : []).map((tag) => <span className="tp-card__tag--small" key={tag}>#{tag}</span>)}
                      </div>
                    )}
                    <h2 className="tp-card__title">
                      <Link to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`}>{blog.heading}</Link>
                    </h2>
                    <p className="tp-card__desc">{blog.shortDescription}</p>
                    <div className="tp-card__foot">
                      <span className="tp-card__by">
                        <span className="tp-card__avatar" aria-hidden="true">
                          {author.charAt(0).toUpperCase()}
                        </span>
                        <Link className="tp-card__author-link" to={`/profile/${encodeURIComponent(author)}`}>{author}</Link>
                      </span>
                      <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default Blogpage;