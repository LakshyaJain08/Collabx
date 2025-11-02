const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  role: {
    type: String,
    enum: ['primary', 'secondary', 'temporary'],
    default: 'secondary'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'active'],
    default: 'pending'
  },
  contractAccepted: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  compensation: {
    type: String
  }
}, {
  timestamps: true
});

membershipSchema.index({ user: 1, activity: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
