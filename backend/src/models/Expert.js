const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: [String],
    required: true,
  },
}, { _id: false });

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Expert name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: 0,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 0,
    max: 5,
  },
  bio: {
    type: String,
    trim: true,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
  availableSlots: {
    type: [slotSchema],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Expert', expertSchema);
