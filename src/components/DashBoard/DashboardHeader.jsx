import { Link } from 'react-router-dom';

const DashboardHeader = ({ user, onRefresh, loading }) => (
  <header className="tp-dashboard__header">
    <div>
      <p className="tp-dashboard__eyebrow">Your TechPulse space</p>
      <h1 className="tp-dashboard__title">Welcome back, {user?.username || 'writer'}.</h1>
      <p className="tp-dashboard__subtitle">
        Keep track of your writing, conversations, and the ideas you want to return to.
      </p>
    </div>
    <div className="tp-actions">
      <Link className="tp-action tp-action--quiet" to={`/profile/${encodeURIComponent(user?.username || '')}`}>
        <i className="fas fa-user" aria-hidden="true" />
        View profile
      </Link>
      <Link className="tp-action" to="/create">
        <i className="fas fa-plus" aria-hidden="true" />
        New article
      </Link>
      <button className="tp-dashboard__refresh" type="button" onClick={onRefresh} disabled={loading}>
        <i className="fas fa-sync-alt" aria-hidden="true" />
        Refresh
      </button>
    </div>
  </header>
);

export default DashboardHeader;