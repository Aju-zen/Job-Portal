const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'employer', 'admin'], default: 'seeker' },
  // Seeker fields
  skills: [String],
  experience: { type: String, default: '' },
  location: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  // Employer fields
  companyName: { type: String, default: '' },
  companyDescription: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
