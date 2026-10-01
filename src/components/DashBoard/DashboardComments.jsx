const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const DashboardComments = ({ comments }) => (
  <section className="tp-panel">
    <div className="tp-panel__head"><div><p className="tp-dashboard__eyebrow">Community</p><h2 className="tp-panel__title">My comments</h2></div></div>
    {comments?.length ? <div className="tp-panel__body"><div className="tp-list">{comments.map((comment) => (
      <article className="tp-list__item" key={comment._id}>
        <div><p className="tp-list__title">{comment.comment}</p><p className="tp-list__meta">On {comment.blog?.heading || 'an article'} · {formatDate(comment.createdAt)}</p></div>
        <span className="tp-badge">{comment.likes?.length || 0} likes</span>
      </article>
    ))}</div></div> : <div className="tp-empty"><span className="tp-empty__icon"><i className="fas fa-comment" aria-hidden="true" /></span><p>You have not joined a discussion yet.</p></div>}
  </section>
);

export default DashboardComments;