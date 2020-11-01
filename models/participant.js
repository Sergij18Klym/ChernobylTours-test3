const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  cost: {
    type: Number,
    required: true
  },
  permission: {
    type: Boolean
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer'
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tour'
  }
});

module.exports = mongoose.model('Participant', participantSchema);