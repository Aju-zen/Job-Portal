const router = require('express').Router();
const Job = require('../models/Job');
const { protect, requireRole } = require('../middleware/auth');

// GET /api/jobs — public, with filters
router.get('/', async (req, res) => {
  try {
    const { search, category, location, type } = req.query;
    const query = { isActive: true };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const jobs = await Job.find(query).populate('employer', 'name companyName').sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id — public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name companyName companyDescription');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs — employer only
router.post('/', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, employer: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/jobs/:id — employer owner or admin
router.put('/:id', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (req.user.role !== 'admin' && job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your job' });

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (req.user.role !== 'admin' && job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your job' });

    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/employer/mine — employer's own jobs
router.get('/employer/mine', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort('-createdAt');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
