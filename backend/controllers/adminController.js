const User = require('../models/User');
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Suspend or activate a user
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.status = status;
    await user.save();
    res.json({ message: `User ${status === 'Suspended' ? 'suspended' : 'activated'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all threads for moderation (including flagged/deleted)
// @route   GET /api/admin/threads
const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Flag a thread
// @route   PUT /api/admin/threads/:id/flag
const flagThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    thread.status = thread.status === 'Flagged' ? 'Clean' : 'Flagged';
    await thread.save();
    res.json({ message: `Thread ${thread.status === 'Flagged' ? 'flagged' : 'unflagged'}`, thread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin delete a thread (soft delete)
// @route   DELETE /api/admin/threads/:id
const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    thread.status = 'Deleted';
    await thread.save();
    res.json({ message: 'Thread deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalThreads, flaggedThreads, suspendedUsers, totalComments] = await Promise.all([
      User.countDocuments(),
      Thread.countDocuments({ status: { $ne: 'Deleted' } }),
      Thread.countDocuments({ status: 'Flagged' }),
      User.countDocuments({ status: 'Suspended' }),
      Comment.countDocuments({ status: { $ne: 'Deleted' } }),
    ]);
    res.json({ totalUsers, totalThreads, flaggedThreads, suspendedUsers, totalComments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, updateUserStatus, getAllThreads, flagThread, deleteThread, getStats };
