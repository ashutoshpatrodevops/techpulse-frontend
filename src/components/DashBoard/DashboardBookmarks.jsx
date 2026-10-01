import { Link } from 'react-router-dom';

const DashboardBookmarks = ({ bookmarks, onRemove }) => (
  <section className="tp-panel">
    <div className="tp-panel__head"><div><p className="tp-dashboard__eyebrow">Reading list</p><h2 className="tp-panel__title">Saved articles</h2></div><Link className="tp-action tp-action--quiet" to="/blogs">Discover more</Link></div>
    {bookmarks?.length ? <div className="tp-panel__body"><div className="tp-bookmark-list">{bookmarks.map((blog) => (
      <article className="tp-bookmark" key={blog._id}>
        <div><h3 className="tp-bookmark__title">{blog.heading}</h3><p className="tp-bookmark__author">By {blog.owner?.username || 'Unknown author'}</p></div>
        <div className="tp-actions"><Link className="tp-link-button" to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`}>Open</Link><button className="tp-link-button" type="button" onClick={() => onRemove(blog._id)}>Remove</button></div>
      </article>
    ))}</div></div> : <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-bookmark" aria-hidden="true" /></span><p>Your reading list is empty.</p><Link className="tp-action" to="/blogs">Explore articles</Link></div>}
  </section>
);

export default DashboardBookmarks;