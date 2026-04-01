require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: 'admin@jobconnect.com' });
  if (existing) {
    console.log('Admin already exists: admin@jobconnect.com / admin123');
    process.exit(0);
  }

  await User.create({ name: 'Admin', email: 'admin@jobconnect.com', password: 'admin123', role: 'admin' });
  console.log('✅ Admin created: admin@jobconnect.com / admin123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
