import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import './Analytics.css';

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalKarma: 0,
    avgUpvotes: 0,
    avgComments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await postsAPI.getPosts();
      const postsData = response.data;
      setPosts(postsData.filter(p => p.status === 'posted'));

      const postedPosts = postsData.filter(p => p.status === 'posted');
      const totalKarma = postedPosts.reduce((sum, p) => sum + (p.analytics?.karma || 0), 0);
      const totalUpvotes = postedPosts.reduce((sum, p) => sum + (p.analytics?.upvotes || 0), 0);
      const totalComments = postedPosts.reduce((sum, p) => sum + (p.analytics?.comments || 0), 0);

      setStats({
        totalPosts: postedPosts.length,
        totalKarma,
        avgUpvotes: postedPosts.length ? Math.round(totalUpvotes / postedPosts.length) : 0,
        avgComments: postedPosts.length ? Math.round(totalComments / postedPosts.length) : 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopPosts = () => {
    return [...posts]
      .sort((a, b) => (b.analytics?.karma || 0) - (a.analytics?.karma || 0))
      .slice(0, 5);
  };

  const getSubredditStats = () => {
    const subredditData = {};

    posts.forEach(post => {
      if (!subredditData[post.subreddit]) {
        subredditData[post.subreddit] = {
          count: 0,
          totalKarma: 0,
        };
      }
      subredditData[post.subreddit].count++;
      subredditData[post.subreddit].totalKarma += post.analytics?.karma || 0;
    });

    return Object.entries(subredditData)
      .map(([name, data]) => ({
        name,
        posts: data.count,
        karma: data.totalKarma,
        avgKarma: Math.round(data.totalKarma / data.count),
      }))
      .sort((a, b) => b.karma - a.karma);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your Reddit growth and performance</p>
      </div>

      <div className="analytics-stats">
        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#e3f2fd' }}>
            <span style={{ fontSize: '32px' }}>📊</span>
          </div>
          <div className="card-content">
            <h3>{stats.totalPosts}</h3>
            <p>Posts Published</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#fff3e0' }}>
            <span style={{ fontSize: '32px' }}>⭐</span>
          </div>
          <div className="card-content">
            <h3>{formatNumber(stats.totalKarma)}</h3>
            <p>Total Karma</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#e8f5e9' }}>
            <span style={{ fontSize: '32px' }}>⬆️</span>
          </div>
          <div className="card-content">
            <h3>{stats.avgUpvotes}</h3>
            <p>Avg Upvotes</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon" style={{ background: '#f3e5f5' }}>
            <span style={{ fontSize: '32px' }}>💬</span>
          </div>
          <div className="card-content">
            <h3>{stats.avgComments}</h3>
            <p>Avg Comments</p>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No analytics available yet</h3>
          <p>Publish some posts to see your analytics!</p>
        </div>
      ) : (
        <div className="analytics-grid">
          <div className="analytics-section">
            <h2>🏆 Top Performing Posts</h2>
            <div className="top-posts-list">
              {getTopPosts().map((post, index) => (
                <div key={post._id} className="top-post-item">
                  <div className="post-rank">#{index + 1}</div>
                  <div className="post-details">
                    <h4>{post.title}</h4>
                    <div className="post-info">
                      <span className="subreddit">r/{post.subreddit}</span>
                      <span className="date">{formatDate(post.postedAt)}</span>
                    </div>
                  </div>
                  <div className="post-stats">
                    <div className="stat">
                      <span className="stat-value">{post.analytics?.karma || 0}</span>
                      <span className="stat-label">Karma</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{post.analytics?.upvotes || 0}</span>
                      <span className="stat-label">Upvotes</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{post.analytics?.comments || 0}</span>
                      <span className="stat-label">Comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section">
            <h2>📍 Subreddit Performance</h2>
            <div className="subreddit-stats-list">
              {getSubredditStats().map((sub) => (
                <div key={sub.name} className="subreddit-stat-item">
                  <div className="subreddit-name">r/{sub.name}</div>
                  <div className="subreddit-metrics">
                    <span>{sub.posts} posts</span>
                    <span>{formatNumber(sub.karma)} karma</span>
                    <span>{sub.avgKarma} avg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
