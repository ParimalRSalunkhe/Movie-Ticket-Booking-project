const { sendEmailNotification } = require('../services/notificationService');

// Create a booking
exports.createBooking = async (req, res) => {
  // Previous booking logic...

  try {
    // Send booking confirmation email
    await sendEmailNotification(
      req.user.email,
      'Booking Confirmation',
      Dear ${req.user.name}, Your booking for movie ${movie.title} has been confirmed.
    );

    res.json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
