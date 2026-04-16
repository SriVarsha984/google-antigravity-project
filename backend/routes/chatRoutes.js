const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get latest chat messages
// @route   GET /api/chat
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: -1 }).limit(50).populate('sender', 'username profilePic');
    res.json(messages.reverse()); // Chronological order for frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Send a chat message
// @route   POST /api/chat
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content is required' });

    const message = await ChatMessage.create({
      sender: req.user._id,
      content
    });

    const populated = await ChatMessage.findById(message._id).populate('sender', 'username profilePic');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
