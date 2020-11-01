const mongoose = require('mongoose');
const Tour = require('./tour');

const driverSchema = new mongoose.Schema({
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
  rentPrice: {
    type: Number,
    required: true,
    default: 1200.00,
    min:500,
    max:20000
  },
  bus: /*[*/{
    numberPlate: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 8
    },
    mark: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30
    },
    capacity: {
      type: Number,
      required: true,
      min: 3,
      max: 30
    }
  }/*]*/,
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  }
});

driverSchema.pre('remove', function(next) {
  Tour.find({ driver: this.id }, (err, tours) => {
    if (err) {
      next(err);
    } else if (tours.length > 0) {
      next(new Error('You cannot delete a Driver associated with an existing Tour'));
    } else {
      next();
    }
  })
});

module.exports = mongoose.model('Driver', driverSchema);