import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Posts API
export const postsAPI = {
  generatePost: (data) => api.post('/posts/generate', data),
  getPosts: () => api.get('/posts'),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  schedulePost: (id, scheduledFor) => api.post(`/posts/${id}/schedule`, { scheduledFor }),
  publishPost: (id) => api.post(`/posts/${id}/publish`),
  getAnalytics: (id) => api.get(`/posts/${id}/analytics`),
};

// Subreddits API
export const subredditsAPI = {
  analyzeSubreddit: (name) => api.post('/subreddits/analyze', { name }),
  getSubreddits: () => api.get('/subreddits'),
  getSubreddit: (name) => api.get(`/subreddits/${name}`),
  getTrending: (name) => api.get(`/subreddits/${name}/trending`),
  getBestTimes: (name) => api.get(`/subreddits/${name}/best-times`),
  getTopPosts: (name, timeframe = 'week', limit = 25) =>
    api.get(`/subreddits/${name}/top-posts?timeframe=${timeframe}&limit=${limit}`),
};

export default api;
