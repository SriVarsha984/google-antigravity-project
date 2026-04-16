const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active',
  },
  bio: {
    type: String,
    default: '',
    maxLength: 200,
  },
  profilePic: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  websiteUrl: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    enum: ['Auto', 'Light', 'Dark'],
    default: 'Dark',
  },
  defaultTab: {
    type: String,
    enum: ['Home', 'Inbox'],
    default: 'Home',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
