const Thread = require('../models/Thread');
const Comment = require('../models/Comment');

// @desc    Get all threads
// @route   GET /api/threads
const getThreads = async (req, res) => {
  try {
    const { domain, search } = req.query;
    const filter = { status: { $ne: 'Deleted' } };
    
    if (domain) {
      filter.domain = domain;
    } else if (search) {
      // Global Knowledge Search: include both general and domain-specific threads
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    } else {
      // Default Feed: Only general community discussions
      filter.domain = '';
    }

    const threads = await Thread.find(filter)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get thread by ID including comments
// @route   GET /api/threads/:id
const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate('author', 'username');
    if (!thread || thread.status === 'Deleted') {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const comments = await Comment.find({ thread: req.params.id, status: { $ne: 'Deleted' } })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.json({ thread, comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new thread
// @route   POST /api/threads
const createThread = async (req, res) => {
  try {
    const { title, content, domain } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const thread = await Thread.create({
      title,
      content,
      domain: domain || '',
      author: req.user._id,
    });

    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a thread
// @route   POST /api/threads/:id/comments
const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const threadId = req.params.id;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      thread: threadId,
    });

    thread.repliesCount += 1;
    await thread.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Delete a thread
// @route   DELETE /api/threads/:id
const deleteThreadAdmin = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Soft delete
    thread.status = 'Deleted';
    await thread.save();
    
    res.json({ message: 'Thread removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getThreads,
  getThreadById,
  createThread,
  addComment,
  deleteThreadAdmin,
};
