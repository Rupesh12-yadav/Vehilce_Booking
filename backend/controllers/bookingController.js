const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      vehicle,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      additionalNotes,
      driverRequired,
    } = req.body;

    // Check if vehicle exists and is available
    const vehicleData = await Vehicle.findById(vehicle);

    if (!vehicleData) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicleData.available) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    // Calculate total days and price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = totalDays * vehicleData.pricePerDay;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      vehicle,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      pickupLocation,
      dropoffLocation,
      additionalNotes,
      driverRequired,
    });

    // Update vehicle availability
    vehicleData.available = false;
    await vehicleData.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('vehicle');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('vehicle');

    if (booking) {
      // Check if user owns this booking or is admin
      if (
        booking.user._id.toString() === req.user._id.toString() ||
        req.user.role === 'admin'
      ) {
        res.json(booking);
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = req.body.status || booking.status;
      booking.paymentStatus = req.body.paymentStatus || booking.paymentStatus;

      // If booking is cancelled or completed, make vehicle available again
      if (booking.status === 'cancelled' || booking.status === 'completed') {
        const vehicle = await Vehicle.findById(booking.vehicle);
        if (vehicle) {
          vehicle.available = true;
          await vehicle.save();
        }
      }

      const updatedBooking = await booking.save();
      const populatedBooking = await Booking.findById(updatedBooking._id)
        .populate('user', 'name email phone')
        .populate('vehicle');

      res.json(populatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Check if user owns this booking
      if (booking.user.toString() === req.user._id.toString()) {
        booking.status = 'cancelled';
        await booking.save();

        // Make vehicle available again
        const vehicle = await Vehicle.findById(booking.vehicle);
        if (vehicle) {
          vehicle.available = true;
          await vehicle.save();
        }

        res.json({ message: 'Booking cancelled' });
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept/Confirm booking (Admin)
// @route   PUT /api/bookings/:id/accept
// @access  Private/Admin
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'confirmed';
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('user', 'name email phone')
      .populate('vehicle');

    res.json({
      message: 'Booking accepted successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject/Cancel booking (Admin)
// @route   PUT /api/bookings/:id/reject
// @access  Private/Admin
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Make vehicle available again
    const vehicle = await Vehicle.findById(booking.vehicle);
    if (vehicle) {
      vehicle.available = true;
      await vehicle.save();
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('vehicle');

    res.json({
      message: 'Booking rejected successfully',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/bookings/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const User = require('../models/User');

    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Bookings by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Total revenue (from completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Total vehicles
    const totalVehicles = await Vehicle.countDocuments();
    const availableVehicles = await Vehicle.countDocuments({ available: true });
    const bookedVehicles = await Vehicle.countDocuments({ available: false });

    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('vehicle', 'name brand model image')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
      },
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        booked: bookedVehicles,
      },
      revenue: {
        total: totalRevenue,
      },
      users: {
        total: totalUsers,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/bookings/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const User = require('../models/User');
    
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get booking count for each user
    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingCount,
        };
      })
    );

    res.json(usersWithBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user-specific bookings (Admin)
// @route   GET /api/bookings/admin/user/:userId
// @access  Private/Admin
exports.getUserBookingsByAdmin = async (req, res) => {
  try {
    const User = require('../models/User');
    
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.json({
      user,
      bookings,
      totalBookings: bookings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
