const cron = require('node-cron');
const Post = require('../models/Post');
const User = require('../models/User');
const redditService = require('./redditService');

class SchedulerService {
  constructor() {
    this.isRunning = false;
  }

  // Start the scheduler
  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    // Run every minute
    cron.schedule('* * * * *', async () => {
      await this.checkScheduledPosts();
    });

    this.isRunning = true;
    console.log('Post scheduler started');
  }

  // Check and publish scheduled posts
  async checkScheduledPosts() {
    try {
      const now = new Date();

      // Find posts scheduled for now or earlier
      const scheduledPosts = await Post.find({
        status: 'scheduled',
        scheduledFor: { $lte: now },
      }).populate('user');

      for (const post of scheduledPosts) {
        await this.publishScheduledPost(post);
      }
    } catch (error) {
      console.error('Scheduler error:', error.message);
    }
  }

  // Publish a scheduled post
  async publishScheduledPost(post) {
    try {
      const user = post.user;

      // Get Reddit account
      const redditAccount = user.redditAccounts.find(
        acc => acc.username === post.redditUsername
      );

      if (!redditAccount) {
        post.status = 'failed';
        await post.save();
        console.error(`No Reddit account found for ${post.redditUsername}`);
        return;
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
        console.error(`Failed to publish post: ${result.json.errors[0]}`);
        return;
      }

      post.status = 'posted';
      post.postedAt = new Date();
      post.redditPostId = result.json?.data?.name;
      await post.save();

      console.log(`Published scheduled post: ${post.title}`);
    } catch (error) {
      post.status = 'failed';
      await post.save();
      console.error(`Error publishing post: ${error.message}`);
    }
  }
}

module.exports = new SchedulerService();
