const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Membership = require('../models/Membership');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hostedActivities = await Activity.find({ host: user._id });
    const memberships = await Membership.find({ user: user._id, status: 'active' })
      .populate('activity', 'title description type');
    const tasks = await Task.find({ assignedTo: user._id });

    res.json({
      user,
      stats: {
        hostedActivities: hostedActivities.length,
        activeMemberships: memberships.length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        totalTasks: tasks.length
      },
      hostedActivities,
      memberships
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/my-activities
// @desc    Get current user's activities
// @access  Private
router.get('/my-activities', auth, async (req, res) => {
  try {
    const hostedActivities = await Activity.find({ host: req.user._id })
      .sort({ createdAt: -1 });
    
    const memberships = await Membership.find({ user: req.user._id, status: 'active' })
      .populate('activity')
      .sort({ createdAt: -1 });

    res.json({
      hosted: hostedActivities,
      participating: memberships.map(m => m.activity)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const allowedUpdates = ['name', 'skills', 'location'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        user[update] = req.body[update];
      }
    });

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
