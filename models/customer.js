const mongoose = require('mongoose');
const Participant = require('./participant');

const customerSchema = new mongoose.Schema({
  createDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    minlength:3,
    maxlength:30
  },
  phone: {
    type: String,
    required: true,
    minlength:6,
    maxlength:12
  },
  email: {
    type: String,
    required: true,
    minlength:3,
    maxlength:30
  },
  passport: {
    type: String,
    required: true,
    minlength:8,
    maxlength:8
  },
  citizenship: {
    type: String,
    required: true,
    enum: ['ukr', 'foreign'],
    default: 'ukr'
  }
});

customerSchema.pre('remove', function(next) {
  Participant.find({ customer: this.id }, (err, participants) => {
    if (err) {
      next(err);
    } else if (participants.length > 0) {
      next(new Error('You cannot delete a Customer who is a Participant in an existing Tour'));
    } else {
      next();
    }
  })
});

module.exports = mongoose.model('Customer', customerSchema);