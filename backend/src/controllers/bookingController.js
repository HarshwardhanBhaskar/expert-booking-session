const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 */
const createBooking = asyncHandler(async (req, res) => {
  const { expertId, name, email, phone, date, slot, notes } = req.body;

  // Validate required fields
  if (!expertId || !name || !email || !phone || !date || !slot) {
    throw new ApiError(400, 'All fields (expertId, name, email, phone, date, slot) are required');
  }

  // Verify expert exists
  const expert = await Expert.findById(expertId);
  if (!expert) {
    throw new ApiError(404, 'Expert not found');
  }

  // Verify the slot is available on the expert's schedule
  const dateEntry = expert.availableSlots.find((s) => s.date === date);
  if (!dateEntry || !dateEntry.slots.includes(slot)) {
    throw new ApiError(400, 'This time slot is not available for the selected date');
  }

  // Check if slot is already booked (application-level check before DB unique index)
  const existingBooking = await Booking.findOne({ expertId, date, slot });
  if (existingBooking) {
    throw new ApiError(409, 'This time slot has already been booked. Please choose another slot.');
  }

  // Create the booking — compound unique index handles race conditions at DB level
  const booking = await Booking.create({
    expertId,
    name,
    email,
    phone,
    date,
    slot,
    notes: notes || '',
  });

  // Emit real-time event to all connected clients
  const io = req.app.get('io');
  if (io) {
    io.emit('slotBooked', {
      expertId,
      date,
      slot,
      bookingId: booking._id,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
  });
});

/**
 * @desc    Update booking status
 * @route   PATCH /api/bookings/:id/status
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['Pending', 'Confirmed', 'Completed'].includes(status)) {
    throw new ApiError(400, 'Status must be one of: Pending, Confirmed, Completed');
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  res.status(200).json({
    success: true,
    message: 'Booking status updated',
    booking,
  });
});

/**
 * @desc    Get bookings by email
 * @route   GET /api/bookings?email=
 */
const getBookings = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new ApiError(400, 'Email query parameter is required');
  }

  const bookings = await Booking.find({ email: email.toLowerCase() })
    .populate('expertId', 'name category profileImage')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});

module.exports = { createBooking, updateBookingStatus, getBookings };
