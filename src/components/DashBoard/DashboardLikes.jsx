import { Link } from 'react-router-dom';

const DashboardLikes = ({ blogs }) => (
  <section className="tp-panel">
    <div className="tp-panel__head">
      <div><p className="tp-dashboard__eyebrow">Your reactions</p><h2 className="tp-panel__title">Articles you like</h2></div>
      <Link className="tp-action tp-action--quiet" to="/blogs">Find more</Link>
    </div>
    {blogs?.length ? <div className="tp-panel__body"><div className="tp-bookmark-list">{blogs.map((blog) => (
      <article className="tp-bookmark" key={blog._id}>
        <div><h3 className="tp-bookmark__title">{blog.heading}</h3><p className="tp-bookmark__author">By {blog.owner?.username || 'Unknown author'}</p></div>
        <Link className="tp-link-button" to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`}>Open</Link>
      </article>
    ))}</div></div> : <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-heart" aria-hidden="true" /></span><p>You have not liked any articles yet.</p><Link className="tp-action" to="/blogs">Explore articles</Link></div>}
  </section>
);

export default DashboardLikes;