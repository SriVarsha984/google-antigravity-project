const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
    required: true,
  },
  status: {
    type: String,
    enum: ['Clean', 'Flagged', 'Deleted'],
    default: 'Clean',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);
