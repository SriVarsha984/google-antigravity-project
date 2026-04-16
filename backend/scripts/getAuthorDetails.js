const mongoose = require('mongoose');
const Thread = require('../models/Thread');
const User = require('../models/User');
require('dotenv').config();

async function getAuthorDetails() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const threads = await Thread.find({
      title: { $in: [/Positivity/i, /Quite Wisdom/i] }
    }).populate('author');

    threads.forEach(t => {
      console.log(`Thread: "${t.title}" | Author Username: ${t.author?.username} | Author ID: ${t.author?._id} | Current Pic: ${t.author?.picture}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Failed to get author details:', err);
    process.exit(1);
  }
}

getAuthorDetails();
