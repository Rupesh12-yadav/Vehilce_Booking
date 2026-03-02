const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  acceptBooking,
  rejectBooking,
  getAdminStats,
  getAllUsers,
  getUserBookingsByAdmin,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/admin/users', protect, admin, getAllUsers);
router.get('/admin/user/:userId', protect, admin, getUserBookingsByAdmin);

// Regular routes
router.route('/').post(protect, createBooking).get(protect, admin, getAllBookings);
router.get('/my-bookings', protect, getUserBookings);

// Booking management routes
router.put('/:id/accept', protect, admin, acceptBooking);
router.put('/:id/reject', protect, admin, rejectBooking);

router
  .route('/:id')
  .get(protect, getBookingById)
  .put(protect, admin, updateBookingStatus)
  .delete(protect, cancelBooking);

module.exports = router;
