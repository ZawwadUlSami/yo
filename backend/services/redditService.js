const axios = require('axios');

class RedditService {
  constructor() {
    this.baseURL = 'https://oauth.reddit.com';
    this.authURL = 'https://www.reddit.com/api/v1';
  }

  // Get Reddit access token
  async getAccessToken(code) {
    try {
      const response = await axios.post(
        `${this.authURL}/access_token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.REDDIT_REDIRECT_URI,
        }),
        {
          auth: {
            username: process.env.REDDIT_CLIENT_ID,
            password: process.env.REDDIT_CLIENT_SECRET,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  // Refresh Reddit access token
  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(
        `${this.authURL}/access_token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          auth: {
            username: process.env.REDDIT_CLIENT_ID,
            password: process.env.REDDIT_CLIENT_SECRET,
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  // Get user info
  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'RedditGrowthTool/1.0',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  // Submit a post
  async submitPost(accessToken, subreddit, title, text, kind = 'self') {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/submit`,
        new URLSearchParams({
          sr: subreddit,
          kind: kind,
          title: title,
          text: text,
          api_type: 'json',
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'RedditGrowthTool/1.0',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit post: ${error.message}`);
    }
  }

  // Get subreddit info
  async getSubredditInfo(subreddit, accessToken = null) {
    try {
      const headers = {
        'User-Agent': 'RedditGrowthTool/1.0',
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await axios.get(
        `${accessToken ? this.baseURL : 'https://www.reddit.com'}/r/${subreddit}/about.json`,
        { headers }
      );
      return response.data.data;
    } catch (error) {
      throw new Error(`Failed to get subreddit info: ${error.message}`);
    }
  }

  // Get subreddit rules
  async getSubredditRules(subreddit) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/about/rules.json`,
        {
          headers: {
            'User-Agent': 'RedditGrowthTool/1.0',
          },
        }
      );
      return response.data.rules;
    } catch (error) {
      throw new Error(`Failed to get subreddit rules: ${error.message}`);
    }
  }

  // Get top posts from subreddit
  async getTopPosts(subreddit, timeframe = 'week', limit = 25) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/top.json?t=${timeframe}&limit=${limit}`,
        {
          headers: {
            'User-Agent': 'RedditGrowthTool/1.0',
          },
        }
      );
      return response.data.data.children;
    } catch (error) {
      throw new Error(`Failed to get top posts: ${error.message}`);
    }
  }

  // Get trending topics
  async getTrendingTopics(subreddit) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`,
        {
          headers: {
            'User-Agent': 'RedditGrowthTool/1.0',
          },
        }
      );

      const posts = response.data.data.children;
      const topicFrequency = {};

      posts.forEach(post => {
        const title = post.data.title.toLowerCase();
        const words = title.split(' ').filter(word => word.length > 4);

        words.forEach(word => {
          topicFrequency[word] = (topicFrequency[word] || 0) + 1;
        });
      });

      return Object.entries(topicFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([topic, count]) => ({ topic, mentions: count }));
    } catch (error) {
      throw new Error(`Failed to get trending topics: ${error.message}`);
    }
  }

  // Analyze best posting times
  async analyzeBestTimes(subreddit) {
    try {
      const posts = await this.getTopPosts(subreddit, 'month', 100);

      const timeAnalysis = {};

      posts.forEach(post => {
        const date = new Date(post.data.created_utc * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const hour = date.getHours();

        const key = `${day}-${hour}`;
        if (!timeAnalysis[key]) {
          timeAnalysis[key] = {
            dayOfWeek: day,
            hour: hour,
            scores: [],
            count: 0,
          };
        }

        timeAnalysis[key].scores.push(post.data.score);
        timeAnalysis[key].count++;
      });

      return Object.values(timeAnalysis)
        .map(item => ({
          dayOfWeek: item.dayOfWeek,
          hour: item.hour,
          averageScore: item.scores.reduce((a, b) => a + b, 0) / item.scores.length,
          postCount: item.count,
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 10);
    } catch (error) {
      throw new Error(`Failed to analyze best times: ${error.message}`);
    }
  }

  // Get post analytics
  async getPostAnalytics(postId, accessToken) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/info.json?id=${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'RedditGrowthTool/1.0',
          },
        }
      );

      const postData = response.data.data.children[0].data;

      return {
        upvotes: postData.ups,
        downvotes: postData.downs,
        comments: postData.num_comments,
        karma: postData.score,
      };
    } catch (error) {
      throw new Error(`Failed to get post analytics: ${error.message}`);
    }
  }
}

module.exports = new RedditService();
