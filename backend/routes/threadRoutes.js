const express = require('express');
const router = express.Router();
const { 
  getThreads, 
  getThreadById, 
  createThread, 
  addComment, 
  deleteThreadAdmin 
} = require('../controllers/threadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getThreads)
  .post(protect, createThread);

router.route('/:id')
  .get(getThreadById)
  .delete(protect, admin, deleteThreadAdmin);

router.post('/:id/comments', protect, addComment);

module.exports = router;
