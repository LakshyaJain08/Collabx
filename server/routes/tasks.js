const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Activity = require('../models/Activity');
const Membership = require('../models/Membership');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get tasks (filtered by activity or user)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { activity, assignedTo } = req.query;
    const filter = {};

    if (activity) filter.activity = activity;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('activity', 'title description')
      .populate('assignedTo', 'username name email')
      .populate('assignedBy', 'username name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('activity', 'title description')
      .populate('assignedTo', 'username name email')
      .populate('assignedBy', 'username name');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Host or Primary member only)
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('activity').notEmpty().withMessage('Activity ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const activity = await Activity.findById(req.body.activity);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if user is host or primary member
    const isHost = activity.host.toString() === req.user._id.toString();
    const membership = await Membership.findOne({
      user: req.user._id,
      activity: activity._id,
      status: 'active'
    });
    const isPrimary = membership && membership.role === 'primary';

    if (!isHost && !isPrimary) {
      return res.status(403).json({ message: 'Not authorized to create tasks' });
    }

    const task = new Task({
      ...req.body,
      assignedBy: req.user._id
    });

    await task.save();
    await task.populate('activity', 'title description');
    await task.populate('assignedTo', 'username name email');

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    const activity = await Activity.findById(task.activity);
    const isHost = activity.host.toString() === req.user._id.toString();
    const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
    const membership = await Membership.findOne({
      user: req.user._id,
      activity: activity._id,
      status: 'active'
    });
    const isPrimary = membership && membership.role === 'primary';

    if (!isHost && !isPrimary && !isAssigned) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update status to completed
    if (req.body.status === 'completed' && !task.completedDate) {
      req.body.completedDate = new Date();
    }

    Object.assign(task, req.body);
    await task.save();

    await task.populate('activity', 'title description');
    await task.populate('assignedTo', 'username name email');

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Host or Primary member only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const activity = await Activity.findById(task.activity);
    const isHost = activity.host.toString() === req.user._id.toString();
    const membership = await Membership.findOne({
      user: req.user._id,
      activity: activity._id,
      status: 'active'
    });
    const isPrimary = membership && membership.role === 'primary';

    if (!isHost && !isPrimary) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
