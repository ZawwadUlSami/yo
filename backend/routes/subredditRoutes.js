const express = require('express');
const router = express.Router();
const {
  analyzeSubreddit,
  getSubreddit,
  getSubreddits,
  getTrending,
  getBestTimes,
  getTopPosts,
} = require('../controllers/subredditController');
const { protect } = require('../middleware/auth');

router.post('/analyze', protect, analyzeSubreddit);
router.get('/', protect, getSubreddits);
router.get('/:name', protect, getSubreddit);
router.get('/:name/trending', protect, getTrending);
router.get('/:name/best-times', protect, getBestTimes);
router.get('/:name/top-posts', protect, getTopPosts);

module.exports = router;
