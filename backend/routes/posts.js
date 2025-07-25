const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  incrementViews,
  getUserPosts,
  getPopularPosts,
  searchPosts
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

const updatePostValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Content must be between 1 and 10000 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Status must be draft, published, or archived')
];

// Public routes
router.get('/search', searchPosts);
router.get('/popular', getPopularPosts);
router.get('/user/:userId', getUserPosts);
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);
router.put('/:id/view', incrementViews);

// Protected routes
router.use(protect); // All routes after this middleware require authentication

router.post('/', postValidation, createPost);
router.put('/:id', updatePostValidation, updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', toggleLike);

module.exports = router; 