const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const groupBookedSlotsByDate = (bookings) => {
  const grouped = new Map();

  bookings.forEach(({ date, slot }) => {
    if (!grouped.has(date)) {
      grouped.set(date, []);
    }

    grouped.get(date).push(slot);
  });

  return Array.from(grouped.entries()).map(([date, slots]) => ({
    date,
    slots: slots.sort(),
  }));
};

/**
 * @desc    Get all experts with pagination, search, and category filter
 * @route   GET /api/experts
 */
const getExperts = asyncHandler(async (req, res) => {
  const { page = 1, search = '', category = '' } = req.query;
  const limit = 6;
  const skip = (parseInt(page) - 1) * limit;

  // Build query filter
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }

  const [experts, total] = await Promise.all([
    Expert.find(filter).skip(skip).limit(limit).sort({ rating: -1 }),
    Expert.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    experts,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    total,
  });
});

/**
 * @desc    Get single expert by ID
 * @route   GET /api/experts/:id
 */
const getExpertById = asyncHandler(async (req, res) => {
  const [expert, bookedSlots] = await Promise.all([
    Expert.findById(req.params.id),
    Booking.find({ expertId: req.params.id }).select('date slot -_id').lean(),
  ]);

  if (!expert) {
    throw new ApiError(404, 'Expert not found');
  }

  res.status(200).json({
    success: true,
    expert,
    bookedSlots: groupBookedSlotsByDate(bookedSlots),
  });
});

/**
 * @desc    Get all unique expert categories
 * @route   GET /api/experts/categories/list
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Expert.distinct('category');

  res.status(200).json({
    success: true,
    categories,
  });
});

module.exports = { getExperts, getExpertById, getCategories };
