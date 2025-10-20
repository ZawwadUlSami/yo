import React, { useState } from 'react';
import { postsAPI } from '../services/api';
import './PostGenerator.css';

const PostGenerator = () => {
  const [topic, setTopic] = useState('');
  const [subreddit, setSubreddit] = useState('');
  const [style, setStyle] = useState('engaging');
  const [generatedPost, setGeneratedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await postsAPI.generatePost({ topic, subreddit, style });
      setGeneratedPost(response.data);
      setSuccess('Post generated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPost) return;

    try {
      setSuccess('Post saved as draft!');
      setTimeout(() => {
        setGeneratedPost(null);
        setTopic('');
        setSubreddit('');
      }, 1500);
    } catch (err) {
      setError('Failed to save post');
    }
  };

  const handleRegenerate = () => {
    setGeneratedPost(null);
    handleGenerate({ preventDefault: () => {} });
  };

  return (
    <div className="post-generator">
      <div className="page-header">
        <h1>AI Post Generator</h1>
        <p>Generate engaging Reddit posts using AI</p>
      </div>

      <div className="generator-container">
        <div className="generator-form">
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Topic / Idea</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to build a successful startup"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Target Subreddit</label>
              <input
                type="text"
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                placeholder="e.g., entrepreneur"
                required
              />
            </div>

            <div className="form-group">
              <label>Writing Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="engaging">Engaging</option>
                <option value="informative">Informative</option>
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : '✨ Generate Post'}
            </button>
          </form>

          <div className="tips">
            <h3>💡 Tips for better results</h3>
            <ul>
              <li>Be specific about your topic</li>
              <li>Research the subreddit's culture first</li>
              <li>Match your writing style to the audience</li>
              <li>Check subreddit rules before posting</li>
            </ul>
          </div>
        </div>

        {generatedPost && (
          <div className="generated-post">
            <div className="post-preview">
              <div className="preview-header">
                <h3>Generated Post Preview</h3>
                <span className="subreddit-tag">r/{generatedPost.subreddit}</span>
              </div>

              <div className="preview-content">
                <h2>{generatedPost.title}</h2>
                <div className="post-body">{generatedPost.content}</div>
              </div>

              <div className="post-actions">
                <button onClick={handleRegenerate} className="btn btn-secondary">
                  🔄 Regenerate
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  💾 Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostGenerator;
