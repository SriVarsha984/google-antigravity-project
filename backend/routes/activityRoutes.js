const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

// @desc    Get global community activity
// @route   GET /api/activity
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Fetch latest threads and comments to create a unified activity feed
    const [threads, comments] = await Promise.all([
      Thread.find({ status: { $ne: 'Deleted' } }).sort({ createdAt: -1 }).limit(10).populate('author', 'username profilePic'),
      Comment.find({ status: { $ne: 'Deleted' } }).sort({ createdAt: -1 }).limit(10).populate('author', 'username profilePic').populate('thread', 'title')
    ]);

    // Format activities
    const threadActivities = threads.map(t => ({
      type: 'thread',
      id: t._id,
      title: t.title,
      user: t.author,
      timestamp: t.createdAt
    }));

    const commentActivities = comments.map(c => ({
      type: 'comment',
      id: c._id,
      threadId: c.thread?._id,
      threadTitle: c.thread?.title,
      user: c.author,
      content: c.content.substring(0, 100) + (c.content.length > 100 ? '...' : ''),
      timestamp: c.createdAt
    }));

    // Combine and sort
    const activityFeed = [...threadActivities, ...commentActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 15);

    res.json(activityFeed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
