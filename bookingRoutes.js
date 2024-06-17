const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// Create a booking
router.post('/', auth, async (req, res) => {
  const { movieId, seats, totalPrice } = req.body;
  const userId = req.user.id;

  try {
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    // Check seat availability
    // Implement seat locking and release logic here

    const newBooking = new Booking({
      user: userId,
      movie: movieId,
      seats,
      totalPrice,
    });

    await newBooking.save();

    res.json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

