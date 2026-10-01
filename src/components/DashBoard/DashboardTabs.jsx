const tabs = [
  ['overview', 'fas fa-chart-line', 'Overview'],
  ['blogs', 'fas fa-blog', 'My blogs'],
  ['comments', 'fas fa-comments', 'Comments'],
  ['bookmarks', 'fas fa-bookmark', 'Saved'],
  ['likes', 'fas fa-heart', 'My likes'],
];

const DashboardTabs = ({ activeTab, onChange, data }) => (
  <nav className="tp-dashboard__tabs" aria-label="Dashboard sections">
    {tabs.map(([id, icon, label]) => {
      const count = id === 'blogs' ? data.blogs?.length : id === 'comments' ? data.comments?.length : id === 'bookmarks' ? data.bookmarks?.length : id === 'likes' ? data.likedBlogs?.length : null;
      return (
        <button
          className={`tp-dashboard__tab${activeTab === id ? ' is-active' : ''}`}
          type="button"
          key={id}
          onClick={() => onChange(id)}
          aria-selected={activeTab === id}
        >
          <i className={`${icon} me-2`} aria-hidden="true" />
          <span className="tp-dashboard__tab-label">{label}{count === null ? '' : ` (${count || 0})`}</span>
        </button>
      );
    })}
  </nav>
);

export default DashboardTabs;