const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({})); // Generic model
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('USERS IN DB:', users.length);
    console.log(users.map(u => ({ username: u.username, email: u.email })));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsers();
