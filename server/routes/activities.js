const express = require('express');
const { body, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const Membership = require('../models/Membership');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, search, location, skill } = req.query;
    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skill) filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };

    let activities = await Activity.find(filter)
      .populate('host', 'username name email')
      .sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      activities = activities.filter(activity => 
        activity.title.match(searchRegex) || 
        activity.description.match(searchRegex)
      );
    }

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('host', 'username name email badges');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const memberships = await Membership.find({ activity: activity._id, status: 'accepted' })
      .populate('user', 'username name email badges');
    
    res.json({ activity, members: memberships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/activities
// @desc    Create a new activity
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['Academic', 'Physical', 'Religious', 'Professional', 'Research', 'Sports', 'Other']).withMessage('Invalid activity type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const activity = new Activity({
      ...req.body,
      host: req.user._id
    });

    await activity.save();
    await activity.populate('host', 'username name email');

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (Host only)
router.put('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(activity, req.body);
    await activity.save();

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/activities/:id/join
// @desc    Request to join an activity
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot join your own activity' });
    }

    const existingMembership = await Membership.findOne({
      user: req.user._id,
      activity: activity._id
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Already requested or joined this activity' });
    }

    const membership = new Membership({
      user: req.user._id,
      activity: activity._id,
      role: req.body.role || 'secondary',
      status: 'pending'
    });

    await membership.save();
    await membership.populate('user', 'username name email');
    await membership.populate('activity', 'title description');

    res.status(201).json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/:id/requests
// @desc    Get collaboration requests for an activity
// @access  Private (Host only)
router.get('/:id/requests', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const requests = await Membership.find({ 
      activity: activity._id,
      status: 'pending'
    }).populate('user', 'username name email skills location badges');

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/activities/:id/requests/:requestId
// @desc    Accept or reject collaboration request
// @access  Private (Host only)
router.put('/:id/requests/:requestId', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (activity.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const membership = await Membership.findById(req.params.requestId);
    
    if (!membership) {
      return res.status(404).json({ message: 'Request not found' });
    }

    membership.status = req.body.status; // 'accepted' or 'rejected'
    if (req.body.status === 'accepted') {
      membership.status = 'active';
    }

    await membership.save();
    await membership.populate('user', 'username name email');

    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
