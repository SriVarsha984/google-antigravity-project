const mongoose = require('mongoose');
const User = require('../models/User'); // Fixed path
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = 'srivarshaprataparao@gmail.com';
    const username = 'varsha';
    const password = 'Varsha_040';

    // Remove existing if any
    await User.deleteOne({ email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      name: 'Varsha',
      status: 'Active'
    });

    console.log(`Success! Master account '${username}' created.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

seedUser();
