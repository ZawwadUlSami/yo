import { mockPosts, mockSubreddits, aiTemplates } from '../data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
const mockAPI = {
  // Auth APIs
  auth: {
    register: async (data) => {
      await delay(800);
      const user = {
        _id: 'demo-user-1',
        name: data.name,
        email: data.email,
        token: 'demo-token-' + Date.now()
      };
      return { data: user };
    },

    login: async (data) => {
      await delay(800);
      // For demo, accept any email/password
      const user = {
        _id: 'demo-user-1',
        name: 'Demo User',
        email: data.email,
        token: 'demo-token-' + Date.now()
      };
      return { data: user };
    },

    getProfile: async () => {
      await delay(500);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return { data: user };
    }
  },

  // Posts APIs
  posts: {
    generatePost: async (data) => {
      await delay(1500); // Simulate AI processing

      const { topic, subreddit, style = 'engaging' } = data;
      const templates = aiTemplates[style] || aiTemplates.engaging;
      const template = templates[Math.floor(Math.random() * templates.length)];

      const generatedPost = {
        _id: 'post-' + Date.now(),
        title: template.title.replace('{topic}', topic),
        content: template.content.replace(/{topic}/g, topic).replace(/{subreddit}/g, subreddit),
        subreddit: subreddit,
        redditUsername: 'demo_user',
        generatedByAI: true,
        aiPrompt: topic,
        status: 'draft',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.push(generatedPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      return { data: generatedPost };
    },

    getPosts: async () => {
      await delay(500);
      const localPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const allPosts = [...mockPosts, ...localPosts];
      return { data: allPosts };
    },

    getPost: async (id) => {
      await delay(300);
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const post = [...mockPosts, ...posts].find(p => p._id === id);
      return { data: post };
    },

    createPost: async (data) => {
      await delay(800);
      const newPost = {
        _id: 'post-' + Date.now(),
        ...data,
        status: 'draft',
        createdAt: new Date().toISOString()
      };

      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.push(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      return { data: newPost };
    },

    updatePost: async (id, data) => {
      await delay(500);
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const index = posts.findIndex(p => p._id === id);
      if (index !== -1) {
        posts[index] = { ...posts[index], ...data };
        localStorage.setItem('posts', JSON.stringify(posts));
      }
      return { data: posts[index] };
    },

    deletePost: async (id) => {
      await delay(500);
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const filtered = posts.filter(p => p._id !== id);
      localStorage.setItem('posts', JSON.stringify(filtered));
      return { data: { message: 'Post deleted' } };
    },

    schedulePost: async (id, scheduledFor) => {
      await delay(500);
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const index = posts.findIndex(p => p._id === id);
      if (index !== -1) {
        posts[index].scheduledFor = scheduledFor;
        posts[index].status = 'scheduled';
        localStorage.setItem('posts', JSON.stringify(posts));
      }
      return { data: posts[index] };
    },

    publishPost: async (id) => {
      await delay(1000);
      alert('🎉 Demo Mode: In the full version, this would post to Reddit!\n\nFor demo purposes, we\'ll mark this as posted.');

      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const index = posts.findIndex(p => p._id === id);
      if (index !== -1) {
        posts[index].status = 'posted';
        posts[index].postedAt = new Date().toISOString();
        posts[index].analytics = {
          upvotes: Math.floor(Math.random() * 100) + 20,
          downvotes: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 30) + 5,
          karma: 0
        };
        posts[index].analytics.karma = posts[index].analytics.upvotes - posts[index].analytics.downvotes;
        localStorage.setItem('posts', JSON.stringify(posts));
      }
      return { data: posts[index] };
    },

    getAnalytics: async (id) => {
      await delay(500);
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      const post = [...mockPosts, ...posts].find(p => p._id === id);
      return { data: post?.analytics || {} };
    }
  },

  // Subreddits APIs
  subreddits: {
    analyzeSubreddit: async (name) => {
      await delay(2000); // Simulate analysis

      // Check if we have mock data for this subreddit
      const existing = mockSubreddits.find(s => s.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        return { data: existing };
      }

      // Generate mock data for new subreddit
      const newSubreddit = {
        name: name,
        subscribers: Math.floor(Math.random() * 500000) + 50000,
        description: `A community for ${name} enthusiasts and discussions.`,
        rules: [
          { title: 'Be respectful', description: 'Treat community members with respect' },
          { title: 'Stay on topic', description: 'Keep posts relevant to the subreddit' },
          { title: 'No spam', description: 'Do not spam or self-promote excessively' }
        ],
        analytics: {
          averageUpvotes: Math.floor(Math.random() * 200) + 50,
          averageComments: Math.floor(Math.random() * 50) + 10,
          topPostingTimes: [
            { dayOfWeek: 'monday', hour: 10, averageScore: 250, postCount: 20 },
            { dayOfWeek: 'wednesday', hour: 14, averageScore: 230, postCount: 18 },
            { dayOfWeek: 'friday', hour: 16, averageScore: 210, postCount: 22 }
          ],
          trendingTopics: [
            { topic: 'discussion', mentions: 34 },
            { topic: 'question', mentions: 28 },
            { topic: 'guide', mentions: 22 },
            { topic: 'tips', mentions: 18 },
            { topic: 'help', mentions: 15 }
          ]
        }
      };

      return { data: newSubreddit };
    },

    getSubreddits: async () => {
      await delay(500);
      return { data: mockSubreddits };
    },

    getSubreddit: async (name) => {
      await delay(500);
      const subreddit = mockSubreddits.find(s => s.name === name);
      return { data: subreddit };
    },

    getTrending: async (name) => {
      await delay(500);
      const subreddit = mockSubreddits.find(s => s.name === name);
      return { data: subreddit?.analytics?.trendingTopics || [] };
    },

    getBestTimes: async (name) => {
      await delay(500);
      const subreddit = mockSubreddits.find(s => s.name === name);
      return { data: subreddit?.analytics?.topPostingTimes || [] };
    },

    getTopPosts: async (name) => {
      await delay(500);
      return { data: mockPosts.filter(p => p.subreddit === name) };
    }
  }
};

export const authAPI = mockAPI.auth;
export const postsAPI = mockAPI.posts;
export const subredditsAPI = mockAPI.subreddits;

export default mockAPI;
