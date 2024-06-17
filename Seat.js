const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Seat', SeatSchema);
