const stats = [
  ['fas fa-blog', 'Blogs', 'totalBlogs'],
  ['fas fa-comments', 'Comments', 'totalComments'],
  ['fas fa-heart', 'Likes', 'totalLikes'],
  ['fas fa-bookmark', 'Saved', 'totalBookmarks'],
  ['fas fa-calendar-alt', 'Active days', 'activeDays'],
];

const DashboardStats = ({ data, activeDays }) => (
  <section className="tp-dashboard__stats" aria-label="Account summary">
    {stats.map(([icon, label, key]) => (
      <article className="tp-stat" key={key}>
        <div className="tp-stat__top">
          <span>{label}</span>
          <span className="tp-stat__icon"><i className={icon} aria-hidden="true" /></span>
        </div>
        <p className="tp-stat__value">{key === 'activeDays' ? activeDays : data[key] || 0}</p>
      </article>
    ))}
  </section>
);

export default DashboardStats;