import React, { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import './PostScheduler.css';

const PostScheduler = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (postId) => {
    const scheduledFor = prompt('Enter schedule date and time (YYYY-MM-DD HH:MM):');
    if (!scheduledFor) return;

    try {
      await postsAPI.schedulePost(postId, new Date(scheduledFor));
      fetchPosts();
    } catch (error) {
      alert('Failed to schedule post');
    }
  };

  const handlePublish = async (postId) => {
    if (!window.confirm('Are you sure you want to publish this post now?')) return;

    try {
      await postsAPI.publishPost(postId);
      alert('Post published successfully!');
      fetchPosts();
    } catch (error) {
      alert('Failed to publish post');
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postsAPI.deletePost(postId);
      fetchPosts();
    } catch (error) {
      alert('Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="post-scheduler">
      <div className="page-header">
        <h1>Post Scheduler</h1>
        <p>Manage and schedule your Reddit posts</p>
      </div>

      <div className="scheduler-controls">
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Posts
          </button>
          <button
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            Drafts
          </button>
          <button
            className={filter === 'scheduled' ? 'active' : ''}
            onClick={() => setFilter('scheduled')}
          >
            Scheduled
          </button>
          <button
            className={filter === 'posted' ? 'active' : ''}
            onClick={() => setFilter('posted')}
          >
            Posted
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No posts found</h3>
          <p>Start by generating your first post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <span className={`status-badge status-${post.status}`}>
                  {post.status}
                </span>
                <span className="subreddit">r/{post.subreddit}</span>
              </div>

              <h3>{post.title}</h3>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>

              <div className="post-footer">
                <div className="post-date">
                  {post.status === 'scheduled' && (
                    <span>📅 {formatDate(post.scheduledFor)}</span>
                  )}
                  {post.status === 'posted' && (
                    <span>✅ {formatDate(post.postedAt)}</span>
                  )}
                  {post.status === 'draft' && (
                    <span>Created {formatDate(post.createdAt)}</span>
                  )}
                </div>

                <div className="post-actions">
                  {post.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handleSchedule(post._id)}
                        className="btn-icon"
                        title="Schedule"
                      >
                        📅
                      </button>
                      <button
                        onClick={() => handlePublish(post._id)}
                        className="btn-icon"
                        title="Publish Now"
                      >
                        🚀
                      </button>
                    </>
                  )}
                  {post.status === 'scheduled' && (
                    <button
                      onClick={() => handlePublish(post._id)}
                      className="btn-icon"
                      title="Publish Now"
                    >
                      🚀
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="btn-icon"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostScheduler;
