const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Clean', 'Flagged', 'Deleted', 'Archived'],
    default: 'Clean',
  },
  repliesCount: {
    type: Number,
    default: 0,
  },
  domain: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Thread', threadSchema);
