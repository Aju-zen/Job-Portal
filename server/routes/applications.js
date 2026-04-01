const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, requireRole } = require('../middleware/auth');

// POST /api/applications — seeker applies
router.post('/', protect, requireRole('seeker'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resumeUrl: req.user.resumeUrl,
    });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/mine — seeker's applications
router.get('/mine', protect, requireRole('seeker'), async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type salary')
      .sort('-createdAt');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/job/:jobId — employer sees applicants for a job
router.get('/job/:jobId', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email skills experience location resumeUrl')
      .sort('-createdAt');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/applications/:id/status — employer updates status
router.put('/:id/status', protect, requireRole('employer', 'admin'), async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
