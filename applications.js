const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, employerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker)
router.post('/', auth, [
  body('jobId', 'Job ID is required').not().isEmpty(),
  body('coverLetter', 'Cover letter is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { jobId, coverLetter, resume } = req.body;

  try {
    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resume
    });

    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/me
// @desc    Get user's applications
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title location jobType employer')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get applications for a job (Employer only)
// @access  Private (Employer)
router.get('/job/:jobId', employerAuth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email profile')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Employer only)
// @access  Private (Employer)
router.put('/:id/status', employerAuth, [
  body('status', 'Status is required').isIn(['pending', 'reviewed', 'accepted', 'rejected'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    application.status = req.body.status;
    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
