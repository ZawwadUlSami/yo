const mongoose = require('mongoose');

const trendingTopicSchema = new mongoose.Schema({
  topic: String,
  mentions: Number,
  score: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const bestTimeSchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  },
  hour: Number,
  averageScore: Number,
  postCount: Number,
});

const subredditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  rules: [{
    title: String,
    description: String,
  }],
  postRequirements: {
    minKarma: Number,
    minAccountAge: Number,
    allowedPostTypes: [String],
  },
  analytics: {
    averageUpvotes: Number,
    averageComments: Number,
    topPostingTimes: [bestTimeSchema],
    trendingTopics: [trendingTopicSchema],
  },
  lastAnalyzed: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Subreddit', subredditSchema);
