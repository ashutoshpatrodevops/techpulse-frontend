import { Link } from 'react-router-dom';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const truncate = (value, length = 90) => value.length > length ? `${value.substring(0, length)}...` : value;

const DashboardOverview = ({ data }) => (
  <div className="tp-dashboard__grid">
    <section className="tp-panel">
      <div className="tp-panel__head">
        <h2 className="tp-panel__title">Recent writing</h2>
        <Link className="tp-link-button" to="/create">Write an article</Link>
      </div>
      <div className="tp-panel__body">
        {data.blogs?.length ? (
          <div className="tp-list">
            {data.blogs.slice(0, 5).map((blog) => (
              <Link className="tp-list__item text-decoration-none" key={blog._id} to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`}>
                <div><p className="tp-list__title">{blog.heading}</p><p className="tp-list__meta">{formatDate(blog.createdAt)}</p></div>
                <span className="tp-badge">{blog.likes?.length || 0} likes</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-pen" aria-hidden="true" /></span><p>No articles yet.</p><Link className="tp-action" to="/create">Start writing</Link></div>
        )}
      </div>
    </section>

    <section className="tp-panel">
      <div className="tp-panel__head"><h2 className="tp-panel__title">Recent conversations</h2></div>
      <div className="tp-panel__body">
        {data.comments?.length ? (
          <div className="tp-list">
            {data.comments.slice(0, 5).map((comment) => (
              <div className="tp-list__item" key={comment._id}>
                <div><p className="tp-list__title">{truncate(comment.comment)}</p><p className="tp-list__meta">On {comment.blog?.heading || 'an article'} · {formatDate(comment.createdAt)}</p></div>
              </div>
            ))}
          </div>
        ) : <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-comment" aria-hidden="true" /></span><p>No comments yet. Join the conversation.</p><Link className="tp-action tp-action--quiet" to="/blogs">Explore articles</Link></div>}
      </div>
    </section>
  </div>
);

export default DashboardOverview;