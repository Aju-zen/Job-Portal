const router = require('express').Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, requireRole } = require('../middleware/auth');

const guard = [protect, requireRole('admin')];

// GET /api/admin/stats
router.get('/stats', ...guard, async (req, res) => {
  try {
    const [users, jobs, applications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
    ]);
    const seekers = await User.countDocuments({ role: 'seeker' });
    const employers = await User.countDocuments({ role: 'employer' });
    res.json({ users, jobs, applications, seekers, employers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', ...guard, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', ...guard, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/jobs
router.get('/jobs', ...guard, async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name companyName').sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', ...guard, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
