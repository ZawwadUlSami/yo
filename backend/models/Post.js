const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  redditUsername: {
    type: String,
    required: true,
  },
  subreddit: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    enum: ['text', 'link', 'image'],
    default: 'text',
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'posted', 'failed'],
    default: 'draft',
  },
  scheduledFor: {
    type: Date,
  },
  postedAt: {
    type: Date,
  },
  redditPostId: {
    type: String,
  },
  analytics: {
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    karma: {
      type: Number,
      default: 0,
    },
    lastUpdated: Date,
  },
  generatedByAI: {
    type: Boolean,
    default: false,
  },
  aiPrompt: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
