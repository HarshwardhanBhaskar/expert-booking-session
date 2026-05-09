const express = require('express');
const router = express.Router();
const { createBooking, updateBookingStatus, getBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);
router.get('/', getBookings);

module.exports = router;
