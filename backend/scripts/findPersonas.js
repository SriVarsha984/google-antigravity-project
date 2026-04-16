const mongoose = require('mongoose');
const User = require('../models/User');
const Thread = require('../models/Thread');
require('dotenv').config();

async function findPersonas() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Searching for users or threads with "Positivity" or "Wisdom"...');

    const users = await User.find({ 
      $or: [
        { username: /Positivity/i },
        { username: /Wisdom/i },
        { name: /Positivity/i },
        { name: /Wisdom/i }
      ] 
    });

    const threads = await Thread.find({
      $or: [
        { title: /Positivity/i },
        { title: /Wisdom/i }
      ]
    });

    console.log('Users found:', users.map(u => ({ id: u._id, username: u.username, name: u.name, picture: u.picture })));
    console.log('Threads found:', threads.map(t => ({ id: t._id, title: t.title })));

    process.exit(0);
  } catch (err) {
    console.error('Search failed:', err);
    process.exit(1);
  }
}

findPersonas();
