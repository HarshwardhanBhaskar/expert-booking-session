const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: [true, 'Expert ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  slot: {
    type: String,
    required: [true, 'Time slot is required'],
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

// Compound unique index to prevent double booking
bookingSchema.index({ expertId: 1, date: 1, slot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
