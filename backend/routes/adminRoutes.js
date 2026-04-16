const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserStatus,
  getAllThreads,
  flagThread,
  deleteThread,
  getStats,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All admin routes require authentication AND admin role
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/threads', getAllThreads);
router.put('/threads/:id/flag', flagThread);
router.delete('/threads/:id', deleteThread);

module.exports = router;
