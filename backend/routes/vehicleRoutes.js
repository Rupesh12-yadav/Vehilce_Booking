const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getFeaturedVehicles,
  getAdminVehicleStats,
  getVehicleBookings,
} = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes
router.get('/admin/stats', protect, admin, getAdminVehicleStats);

// Regular routes
router.route('/').get(getAllVehicles).post(protect, admin, createVehicle);
router.get('/featured', getFeaturedVehicles);

// Vehicle-specific routes
router.get('/:id/bookings', protect, admin, getVehicleBookings);
router
  .route('/:id')
  .get(getVehicleById)
  .put(protect, admin, updateVehicle)
  .delete(protect, admin, deleteVehicle);

module.exports = router;
