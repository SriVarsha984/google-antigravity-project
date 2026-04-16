const mongoose = require('mongoose');
const User = require('../models/User');
const Thread = require('../models/Thread');
const Comment = require('../models/Comment');
const bcrypt = require('bcryptjs'); // For secure hashing
require('dotenv').config();

async function updatePersonas() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const demoPassword = await bcrypt.hash('password123', 10);

    // 1. Handle "Quiet Wisdom"
    let wisdomUser = await User.findOne({ username: 'QuietWisdom' });
    if (!wisdomUser) {
      wisdomUser = await User.create({
        username: 'QuietWisdom',
        name: 'Quiet Wisdom',
        email: 'wisdom@demo.com',
        password: demoPassword,
        role: 'user',
        picture: '/avatars/wisdom.png',
        bio: 'A voice of reflection and stillness in a busy world.'
      });
    } else {
      wisdomUser.picture = '/avatars/wisdom.png';
      await wisdomUser.save();
    }
    
    // Assign "Quite Wisdom" thread to this user
    await Thread.updateOne({ title: 'Quite Wisdom' }, { author: wisdomUser._id });

    // 2. Handle "Positivity"
    let positivityUser = await User.findOne({ username: 'Positivity' });
    if (!positivityUser) {
      positivityUser = await User.create({
        username: 'Positivity',
        name: 'Positivity',
        email: 'positivity@demo.com',
        password: demoPassword,
        role: 'user',
        picture: '/avatars/positivity.png',
        bio: 'Spreading light, energy, and constructive vibes across the forum.'
      });
    } else {
      positivityUser.picture = '/avatars/positivity.png';
      await positivityUser.save();
    }

    // Assign "Positivity" thread to this user
    await Thread.updateOne({ title: 'Positivity' }, { author: positivityUser._id });

    console.log('Success! Personas updated with premium PFPs and threads reassigned.');
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
}

updatePersonas();
