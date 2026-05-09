import API from './axios';

// Expert APIs
export const getExperts = (params) => API.get('/experts', { params });
export const getExpertById = (id) => API.get(`/experts/${id}`);
export const getCategories = () => API.get('/experts/categories/list');

// Booking APIs
export const createBooking = (data) => API.post('/bookings', data);
export const getBookingsByEmail = (email) => API.get('/bookings', { params: { email } });
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
