const mongoose = require('mongoose');
const Thread = require('./models/Thread');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const counts = await Thread.aggregate([
    { $match: { domain: { $ne: '' } } },
    { $group: { _id: '$domain', count: { $sum: 1 } } }
  ]);
  console.log(JSON.stringify(counts, null, 2));
  process.exit(0);
}

check();
