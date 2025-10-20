import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Reddit Growth</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <span>Dashboard</span>
          </Link>
          <Link to="/generate" className="nav-item">
            <span>AI Post Generator</span>
          </Link>
          <Link to="/scheduler" className="nav-item">
            <span>Post Scheduler</span>
          </Link>
          <Link to="/analyzer" className="nav-item">
            <span>Subreddit Analyzer</span>
          </Link>
          <Link to="/analytics" className="nav-item">
            <span>Analytics</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <p>{user?.name}</p>
            <small>{user?.email}</small>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
