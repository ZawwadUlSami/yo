import React, { useState } from 'react';
import { subredditsAPI } from '../services/api';
import './SubredditAnalyzer.css';

const SubredditAnalyzer = () => {
  const [subreddit, setSubreddit] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await subredditsAPI.analyzeSubreddit(subreddit);
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze subreddit');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getTimeString = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  };

  return (
    <div className="subreddit-analyzer">
      <div className="page-header">
        <h1>Subreddit Analyzer</h1>
        <p>Get insights and analytics for any subreddit</p>
      </div>

      <div className="analyzer-form">
        <form onSubmit={handleAnalyze}>
          <div className="search-box">
            <span className="prefix">r/</span>
            <input
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="Enter subreddit name"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Analyzing...' : '🔍 Analyze'}
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {analysis && (
        <div className="analysis-results">
          <div className="stats-section">
            <div className="stat-box">
              <div className="stat-icon">👥</div>
              <div>
                <h3>{formatNumber(analysis.subscribers)}</h3>
                <p>Subscribers</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">⬆️</div>
              <div>
                <h3>{Math.round(analysis.analytics.averageUpvotes)}</h3>
                <p>Avg Upvotes</p>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">💬</div>
              <div>
                <h3>{Math.round(analysis.analytics.averageComments)}</h3>
                <p>Avg Comments</p>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <h3>📋 Subreddit Rules</h3>
              {analysis.rules && analysis.rules.length > 0 ? (
                <div className="rules-list">
                  {analysis.rules.map((rule, index) => (
                    <div key={index} className="rule-item">
                      <h4>{rule.title}</h4>
                      <p>{rule.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No rules available</p>
              )}
            </div>

            <div className="info-card">
              <h3>🔥 Trending Topics</h3>
              {analysis.analytics.trendingTopics && analysis.analytics.trendingTopics.length > 0 ? (
                <div className="trending-list">
                  {analysis.analytics.trendingTopics.map((topic, index) => (
                    <div key={index} className="trending-item">
                      <span className="topic-name">{topic.topic}</span>
                      <span className="topic-count">{topic.mentions} mentions</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No trending topics available</p>
              )}
            </div>

            <div className="info-card">
              <h3>⏰ Best Times to Post</h3>
              {analysis.analytics.topPostingTimes && analysis.analytics.topPostingTimes.length > 0 ? (
                <div className="times-list">
                  {analysis.analytics.topPostingTimes.slice(0, 5).map((time, index) => (
                    <div key={index} className="time-item">
                      <div className="time-info">
                        <span className="day">{getDayName(time.dayOfWeek)}</span>
                        <span className="hour">{getTimeString(time.hour)}</span>
                      </div>
                      <div className="time-score">
                        <span>Avg Score: {Math.round(time.averageScore)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No timing data available</p>
              )}
            </div>

            <div className="info-card">
              <h3>ℹ️ About</h3>
              <p className="description">
                {analysis.description || 'No description available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubredditAnalyzer;
