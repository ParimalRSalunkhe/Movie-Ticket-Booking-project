const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Screen = require('../models/Screen');
const Seat = require('../models/Seat');

// Create a new screen
router.post('/screens', auth, async (req, res) => {
  const { screenName, capacity } = req.body;

  try {
    const newScreen = new Screen({
      screenName,
      capacity,
    });

    await newScreen.save();

    res.json(newScreen);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update seats for a screen
router.put('/screens/:id/seats', auth, async (req, res) => {
  const { seats } = req.body;

  try {
    await Seat.deleteMany({ screen: req.params.id });

    const seatObjects = seats.map(seat => ({
      screen: req.params.id,
      seatNumber: seat.seatNumber,
    }));

    await Seat.insertMany(seatObjects);

    res.json({ msg: 'Seats updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
