import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    drafted: 0,
    scheduled: 0,
    posted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      const postsData = response.data;
      setPosts(postsData.slice(0, 5));

      setStats({
        total: postsData.length,
        drafted: postsData.filter(p => p.status === 'draft').length,
        scheduled: postsData.filter(p => p.status === 'scheduled').length,
        posted: postsData.filter(p => p.status === 'posted').length,
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Reddit Growth Tool</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>
            <span style={{ color: '#1976d2' }}>📊</span>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>
            <span style={{ color: '#f57c00' }}>📝</span>
          </div>
          <div className="stat-content">
            <h3>{stats.drafted}</h3>
            <p>Drafts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f3e5f5' }}>
            <span style={{ color: '#7b1fa2' }}>⏰</span>
          </div>
          <div className="stat-content">
            <h3>{stats.scheduled}</h3>
            <p>Scheduled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>
            <span style={{ color: '#388e3c' }}>✅</span>
          </div>
          <div className="stat-content">
            <h3>{stats.posted}</h3>
            <p>Posted</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <Link to="/generate" className="action-card">
            <div className="action-icon">🤖</div>
            <h3>Generate Post</h3>
            <p>Create AI-powered Reddit posts</p>
          </Link>

          <Link to="/analyzer" className="action-card">
            <div className="action-icon">🔍</div>
            <h3>Analyze Subreddit</h3>
            <p>Get insights and trending topics</p>
          </Link>

          <Link to="/scheduler" className="action-card">
            <div className="action-icon">📅</div>
            <h3>Schedule Posts</h3>
            <p>Plan your posting strategy</p>
          </Link>

          <Link to="/analytics" className="action-card">
            <div className="action-icon">📈</div>
            <h3>View Analytics</h3>
            <p>Track your growth and performance</p>
          </Link>
        </div>
      </div>

      <div className="recent-posts">
        <div className="section-header">
          <h2>Recent Posts</h2>
          <Link to="/scheduler" className="view-all">View All</Link>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Start by generating your first post!</p>
            <Link to="/generate" className="btn btn-primary">Generate Post</Link>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post._id} className="post-item">
                <div className="post-info">
                  <h3>{post.title}</h3>
                  <div className="post-meta">
                    <span className="subreddit">r/{post.subreddit}</span>
                    <span className="date">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className={`status-badge status-${post.status}`}>
                  {post.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
