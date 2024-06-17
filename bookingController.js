const Booking = require('../models/Booking');
const Seat = require('../models/Seat');

// Create a booking
exports.createBooking = async (req, res) => {
  const { movieId, seats, totalPrice } = req.body;
  const userId = req.user.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check seat availability
    const bookedSeats = await Seat.find({ seatNumber: { $in: seats }, isBooked: true }).session(session);
    if (bookedSeats.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: 'Some seats are already booked' });
    }

    // Reserve seats
    const reservedSeats = await Seat.updateMany(
      { seatNumber: { $in: seats } },
      { $set: { isBooked: true } }
    ).session(session);

    if (reservedSeats.nModified !== seats.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ msg: 'Failed to reserve seats' });
    }

    const newBooking = new Booking({
      user: userId,
      movie: movieId,
      seats,
      totalPrice,
    });

    await newBooking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json(newBooking);
  } catch (err) {
    console.error(err.message);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Server Error');
  }
};
