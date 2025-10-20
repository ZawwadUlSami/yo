const Subreddit = require('../models/Subreddit');
const redditService = require('../services/redditService');

// @desc    Analyze subreddit
// @route   POST /api/subreddits/analyze
// @access  Private
const analyzeSubreddit = async (req, res) => {
  try {
    const { name } = req.body;

    // Get subreddit info
    const info = await redditService.getSubredditInfo(name);
    const rules = await redditService.getSubredditRules(name);
    const trending = await redditService.getTrendingTopics(name);
    const bestTimes = await redditService.analyzeBestTimes(name);

    // Get top posts for analytics
    const topPosts = await redditService.getTopPosts(name, 'week', 50);
    const scores = topPosts.map(post => post.data.score);
    const comments = topPosts.map(post => post.data.num_comments);

    const averageUpvotes = scores.reduce((a, b) => a + b, 0) / scores.length;
    const averageComments = comments.reduce((a, b) => a + b, 0) / comments.length;

    // Save or update subreddit data
    let subreddit = await Subreddit.findOne({ name });

    if (subreddit) {
      subreddit.subscribers = info.subscribers;
      subreddit.description = info.public_description;
      subreddit.rules = rules.map(rule => ({
        title: rule.short_name,
        description: rule.description,
      }));
      subreddit.analytics = {
        averageUpvotes,
        averageComments,
        topPostingTimes: bestTimes,
        trendingTopics: trending,
      };
      subreddit.lastAnalyzed = new Date();
    } else {
      subreddit = await Subreddit.create({
        name,
        subscribers: info.subscribers,
        description: info.public_description,
        rules: rules.map(rule => ({
          title: rule.short_name,
          description: rule.description,
        })),
        analytics: {
          averageUpvotes,
          averageComments,
          topPostingTimes: bestTimes,
          trendingTopics: trending,
        },
        lastAnalyzed: new Date(),
      });
    }

    await subreddit.save();
    res.json(subreddit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subreddit info
// @route   GET /api/subreddits/:name
// @access  Private
const getSubreddit = async (req, res) => {
  try {
    const subreddit = await Subreddit.findOne({ name: req.params.name });

    if (!subreddit) {
      return res.status(404).json({ message: 'Subreddit not found in database. Please analyze it first.' });
    }

    res.json(subreddit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all analyzed subreddits
// @route   GET /api/subreddits
// @access  Private
const getSubreddits = async (req, res) => {
  try {
    const subreddits = await Subreddit.find().sort({ lastAnalyzed: -1 });
    res.json(subreddits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending topics for subreddit
// @route   GET /api/subreddits/:name/trending
// @access  Private
const getTrending = async (req, res) => {
  try {
    const trending = await redditService.getTrendingTopics(req.params.name);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get best posting times
// @route   GET /api/subreddits/:name/best-times
// @access  Private
const getBestTimes = async (req, res) => {
  try {
    const bestTimes = await redditService.analyzeBestTimes(req.params.name);
    res.json(bestTimes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top posts from subreddit
// @route   GET /api/subreddits/:name/top-posts
// @access  Private
const getTopPosts = async (req, res) => {
  try {
    const { timeframe = 'week', limit = 25 } = req.query;
    const posts = await redditService.getTopPosts(req.params.name, timeframe, parseInt(limit));

    const formattedPosts = posts.map(post => ({
      id: post.data.id,
      title: post.data.title,
      author: post.data.author,
      score: post.data.score,
      comments: post.data.num_comments,
      created: new Date(post.data.created_utc * 1000),
      url: `https://reddit.com${post.data.permalink}`,
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  analyzeSubreddit,
  getSubreddit,
  getSubreddits,
  getTrending,
  getBestTimes,
  getTopPosts,
};
