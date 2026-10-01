import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaCheck, FaLock } from 'react-icons/fa';
import './AccountSettings.css';

const API = import.meta.env.VITE_API_URL;

const AccountSettings = () => {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState([]);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);

  const loadNotifications = async () => {
    try {
      const response = await axios.get(`${API}/users/notifications`, { withCredentials: true });
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    try {
      setSavingPassword(true);
      const response = await axios.put(`${API}/users/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }, { withCredentials: true });
      setPasswordMessage(response.data.message);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const markRead = async (notificationId) => {
    await axios.patch(`${API}/users/notifications/${notificationId}/read`, {}, { withCredentials: true });
    setNotifications((current) => current.map((notification) => notification._id === notificationId ? { ...notification, read: true } : notification));
  };

  const markAllRead = async () => {
    await axios.patch(`${API}/users/notifications/read-all`, {}, { withCredentials: true });
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  };

  return (
    <main className="tp-settings">
      <div className="tp-settings__shell">
        <header className="tp-settings__header"><p className="tp-settings__eyebrow">Account settings</p><h1>Keep your account secure.</h1><p>Manage your password and stay up to date with activity around your profile.</p></header>
        <div className="tp-settings__grid">
          <section className="tp-settings__panel">
            <div className="tp-settings__panel-head"><span className="tp-settings__icon"><FaLock /></span><div><h2>Change password</h2><p>Use a strong password you do not reuse elsewhere.</p></div></div>
            <form onSubmit={changePassword} className="tp-settings__form">
              <label>Current password<input type="password" required value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} /></label>
              <label>New password<input type="password" required minLength={8} value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} /></label>
              <label>Confirm new password<input type="password" required minLength={8} value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} /></label>
              {passwordError && <p className="tp-settings__message is-error">{passwordError}</p>}
              {passwordMessage && <p className="tp-settings__message is-success">{passwordMessage}</p>}
              <button type="submit" disabled={savingPassword}>{savingPassword ? 'Changing...' : 'Change password'}</button>
            </form>
          </section>

          <section className="tp-settings__panel">
            <div className="tp-settings__panel-head"><span className="tp-settings__icon"><FaBell /></span><div><h2>Notifications</h2><p>New follower activity on your TechPulse profile.</p></div></div>
            <div className="tp-settings__notification-actions"><span>{notifications.filter((notification) => !notification.read).length} unread</span><button type="button" onClick={markAllRead}>Mark all read</button></div>
            {loadingNotifications ? <p className="tp-settings__empty">Loading notifications...</p> : notifications.length === 0 ? <p className="tp-settings__empty">No notifications yet.</p> : <div className="tp-settings__notifications">{notifications.map((notification) => <article className={`tp-settings__notification${notification.read ? '' : ' is-unread'}`} key={notification._id}><span className="tp-settings__notification-avatar">{notification.actor?.username?.charAt(0).toUpperCase() || 'T'}</span><div><p>{notification.message}</p><small>{new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small></div>{!notification.read && <button type="button" aria-label="Mark notification as read" onClick={() => markRead(notification._id)}><FaCheck /></button>}</article>)}</div>}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AccountSettings;