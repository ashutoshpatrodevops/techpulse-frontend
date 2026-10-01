import { Link } from 'react-router-dom';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const DashboardBlogs = ({ blogs }) => (
  <section className="tp-panel">
    <div className="tp-panel__head">
      <div><p className="tp-dashboard__eyebrow">Creator desk</p><h2 className="tp-panel__title">My articles</h2></div>
      <Link className="tp-action" to="/create"><i className="fas fa-plus" aria-hidden="true" /> New article</Link>
    </div>
    {blogs?.length ? (
      <div className="tp-table-wrap">
        <table className="tp-table">
          <thead><tr><th>Article</th><th>Comments</th><th>Likes</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>{blogs.map((blog) => (
            <tr key={blog._id}>
              <td><span className="tp-table__title">{blog.heading}</span><br /><span className="tp-list__meta">{blog.genre}</span></td>
              <td><span className="tp-badge">{blog.comments?.length || 0}</span></td>
              <td><span className="tp-badge">{blog.likes?.length || 0}</span></td>
              <td>{formatDate(blog.createdAt)}</td>
              <td><div className="tp-actions"><Link className="tp-link-button" to={blog.slug ? `/blog/${blog.slug}` : `/blogs/${blog._id}`}>View</Link><Link className="tp-link-button" to={`/edit/${blog._id}`}>Edit</Link></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    ) : <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-pen" aria-hidden="true" /></span><p>Your publishing desk is empty.</p><Link className="tp-action" to="/create">Write your first article</Link></div>}
  </section>
);

export default DashboardBlogs;