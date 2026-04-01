require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const Job = require('./models/Job');
const User = require('./models/User');

// Read directly from joblist.json
const joblist = require(path.join(__dirname, '../joblist.json'));

async function seedJobs() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌ Admin user not found. Run: node seed.js first');
    process.exit(1);
  }

  let added = 0, skipped = 0;

  for (const job of joblist) {
    const exists = await Job.findOne({ title: job.title, company: job.company });
    if (exists) { skipped++; continue; }

    await Job.create({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      salary: job.salary,
      description: job.description,
      skills: job.skills.split(',').map(s => s.trim()),
      employer: admin._id,
    });
    added++;
    console.log(`  ✅ Added: ${job.title} @ ${job.company}`);
  }

  console.log(`\nDone! Added: ${added} | Skipped (already exist): ${skipped}`);
  process.exit(0);
}

seedJobs().catch(err => { console.error(err); process.exit(1); });
