const express = require('express');
const router = express.Router();
const {
  generatePost,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  schedulePost,
  publishPost,
  getPostAnalytics,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generatePost);
router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.get('/:id', protect, getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/schedule', protect, schedulePost);
router.post('/:id/publish', protect, publishPost);
router.get('/:id/analytics', protect, getPostAnalytics);

module.exports = router;
