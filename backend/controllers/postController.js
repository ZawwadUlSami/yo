const Post = require('../models/Post');
const aiService = require('../services/aiService');
const redditService = require('../services/redditService');

// @desc    Generate AI post
// @route   POST /api/posts/generate
// @access  Private
const generatePost = async (req, res) => {
  try {
    const { topic, subreddit, style } = req.body;

    // Get subreddit info for context
    const subredditInfo = await redditService.getSubredditInfo(subreddit);

    // Generate post using AI
    const generatedPost = await aiService.generatePost(topic, subreddit, subredditInfo, style);

    // Save as draft
    const post = await Post.create({
      user: req.user._id,
      redditUsername: req.user.redditAccounts[0]?.username || 'default',
      subreddit,
      title: generatedPost.title,
      content: generatedPost.content,
      generatedByAI: true,
      aiPrompt: topic,
      status: 'draft',
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts for user
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { subreddit, title, content, redditUsername } = req.body;

    const post = await Post.create({
      user: req.user._id,
      redditUsername: redditUsername || req.user.redditAccounts[0]?.username,
      subreddit,
      title,
      content,
      status: 'draft',
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule post
// @route   POST /api/posts/:id/schedule
// @access  Private
const schedulePost = async (req, res) => {
  try {
    const { scheduledFor } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.scheduledFor = scheduledFor;
    post.status = 'scheduled';
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Publish post to Reddit
// @route   POST /api/posts/:id/publish
// @access  Private
const publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Get Reddit account
    const redditAccount = req.user.redditAccounts.find(
      acc => acc.username === post.redditUsername
    );

    if (!redditAccount) {
      return res.status(400).json({ message: 'Reddit account not connected' });
    }

    // Submit to Reddit
    const result = await redditService.submitPost(
      redditAccount.accessToken,
      post.subreddit,
      post.title,
      post.content
    );

    if (result.json?.errors?.length > 0) {
      post.status = 'failed';
      await post.save();
      return res.status(400).json({ message: result.json.errors[0] });
    }

    post.status = 'posted';
    post.postedAt = new Date();
    post.redditPostId = result.json?.data?.name;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post analytics
// @route   GET /api/posts/:id/analytics
// @access  Private
const getPostAnalytics = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!post.redditPostId) {
      return res.status(400).json({ message: 'Post not published yet' });
    }

    const redditAccount = req.user.redditAccounts.find(
      acc => acc.username === post.redditUsername
    );

    const analytics = await redditService.getPostAnalytics(
      post.redditPostId,
      redditAccount.accessToken
    );

    post.analytics = {
      ...analytics,
      lastUpdated: new Date(),
    };
    await post.save();

    res.json(post.analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generatePost,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  schedulePost,
  publishPost,
  getPostAnalytics,
};
