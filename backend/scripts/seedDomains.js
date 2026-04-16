const mongoose = require('mongoose');
const Thread = require('../models/Thread');
const User = require('../models/User');
const Comment = require('../models/Comment');
require('dotenv').config();

const INTERESTS = [
  "Culture", "Technology", "Business", "Politics", "Finance",
  "Food and drink", "Sports", "Art and Illustration", "World politics",
  "Health politics", "News", "Fashion & beauty", "Music", 
  "Faith & spirituality", "Climate & environment", "Science", 
  "Literature", "Fiction", "Health and wellness", "Design", 
  "Travel", "Parenting", "Philosophy", "Cosmics", "International", 
  "Crypto", "History", "Humor", "Education", "Film & TV"
];

const EXPERTS = [
  { username: 'Curator', email: 'curator@demo.com' },
  { username: 'TechExplorer', email: 'tech@demo.com' },
  { username: 'InsightBot', email: 'insight@demo.com' },
  { username: 'PolicyWatcher', email: 'policy@demo.com' },
  { username: 'ScienceHub', email: 'science@demo.com' },
  { username: 'CultureGuide', email: 'culture@demo.com' },
  { username: 'FinanceDaily', email: 'finance@demo.com' },
  { username: 'LifeStrategist', email: 'life@demo.com' },
  { username: 'WorldReview', email: 'world@demo.com' },
  { username: 'CreativeMind', email: 'creative@demo.com' }
];

const generateLongContent = (domain, index) => {
  const titles = [
    `${domain}: The Definitive Intelligence Briefing (2026)`,
    `Advanced Methodologies in ${domain} Mastery`,
    `The Global Impact of ${domain} on Future Civilizations`
  ];

  const baseText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 

Throughout the 21st century, the landscape of ${domain} has undergone a radical transformation. What was once a niche interest has now become a cornerstone of global infrastructure. This comprehensive analysis explores the multifaceted dimensions of ${domain}, from its historical roots to the cutting-edge developments that are currently shaping our world.

Section 1: The Historical Context
The origins of ${domain} can be traced back to the early days of industrial integration. Researchers noticed that the confluence of technology and human intuition created a unique synergetic effect. Over the decades, this led to the creation of several frameworks that we still use today.

Section 2: Market Dynamics and Economic Influence
Economically, ${domain} represents one of the fastest-growing sectors in the global economy. Investors and policymakers alike are paying close attention to the fluctuations in this space, as it often serves as a leading indicator for broader sociotechnical shifts. We must consider the ethical implications of this growth, particularly concerning accessibility and data sovereignty.

Section 3: Practical Applications and Best Practices
When engaging with ${domain}, it is essential to follow established protocols. This includes continuous monitoring, interdisciplinary collaboration, and a commitment to radical transparency. By fostering an environment of shared knowledge, we can accelerate the pace of innovation and ensure that the benefits of ${domain} are distributed equitably across all layers of society.

Section 4: The Future Horizon
Looking ahead to 2030 and beyond, the role of ${domain} will only become more pronounced. We anticipate a deeper integration with neural networks and decentralized autonomous organizations. The challenge for future researchers will be maintaining the human element within these increasingly automated systems.

In conclusion, ${domain} remains one of the most exciting and critical fields of study in the modern era. This resource serves as a foundation for your continued exploration and mastery of the subject. Use the linked references and community discussions to deepen your understanding.`;

  // Repeat/pad to ensure ~2000 characters
  let longForm = baseText;
  while (longForm.length < 2000) {
    longForm += "\n\n" + baseText.substring(0, 500);
  }

  return {
    title: titles[index],
    content: longForm,
    domain: domain,
    status: 'Clean'
  };
};

const COMMENTS = [
  "This intelligence briefing is incredibly thorough. The section on historical context really helped clear up some misconceptions I had.",
  "Excellent points regarding the economic influence. We definitely need more focus on decentralized systems in this space.",
  "I've been following this domain for years, and this is by far the most comprehensive summary I've seen. Looking forward to more!",
  "The future horizon section is particularly intriguing. Are there any specific papers you'd recommend on the neural network integration?",
  "Quality content as always from the expert team. This should be required reading for anyone entering the field.",
  "I disagree slightly with the market dynamics analysis, but the overall framework is solid. Thanks for sharing!"
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for massive seeding...');

    // 1. Prepare Authors
    const authorIds = [];
    for (const exp of EXPERTS) {
      let user = await User.findOne({ username: exp.username });
      if (!user) {
        user = await User.create({
          ...exp,
          password: 'password123',
          role: 'user',
          bio: `Specialized expert in global intelligence and the ${INTERESTS[Math.floor(Math.random() * INTERESTS.length)]} domain.`
        });
      }
      authorIds.push(user._id);
    }

    // 2. Clear existing domain threads and comments
    // First, find IDs of domain-specific threads to clear their comments
    const domainThreads = await Thread.find({ domain: { $ne: '' } });
    const domainThreadIds = domainThreads.map(t => t._id);
    
    await Comment.deleteMany({ thread: { $in: domainThreadIds } });
    await Thread.deleteMany({ domain: { $ne: '' } });
    console.log('Cleared existing domain threads and their comments.');

    // 3. Generate and insert
    let threadCount = 0;
    let commentCount = 0;

    for (const domain of INTERESTS) {
      for (let i = 0; i < 3; i++) {
        const randomAuthorId = authorIds[Math.floor(Math.random() * authorIds.length)];
        const threadData = generateLongContent(domain, i);
        threadData.author = randomAuthorId;

        const thread = await Thread.create(threadData);
        threadCount++;

        // Add 1-2 comments per thread
        const numComments = Math.floor(Math.random() * 2) + 1;
        for (let c = 0; c < numComments; c++) {
          const commentAuthorId = authorIds[Math.floor(Math.random() * authorIds.length)];
          const commentText = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
          
          await Comment.create({
            content: commentText,
            author: commentAuthorId,
            thread: thread._id,
            status: 'Clean'
          });
          commentCount++;
        }
      }
      process.stdout.write(`.`); // Progress indicator
    }

    console.log(`\n\nSuccess! Seeded ${threadCount} long-form threads and ${commentCount} interactive comments across ${INTERESTS.length} domains.`);
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
