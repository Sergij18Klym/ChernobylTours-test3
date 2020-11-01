const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  tourType: {
    type: String,
    required: true,
    enum: ['oneDay', 'twoDay'],
    default: 'oneDay'
  },
  startDate: {
    type: Date,
    required: true
  },
  actual: {
    type: Boolean
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver'
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Guide'
  }
});

module.exports = mongoose.model('Tour', tourSchema);