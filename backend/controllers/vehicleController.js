const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Public
exports.getAllVehicles = async (req, res) => {
  try {
    const { type, fuelType, transmission, minPrice, maxPrice, available } = req.query;

    let query = {};

    if (type) query.type = type;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (available) query.available = available === 'true';
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      Object.assign(vehicle, req.body);
      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured vehicles
// @route   GET /api/vehicles/featured
// @access  Public
exports.getFeaturedVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true })
      .sort({ rating: -1 })
      .limit(6);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin vehicles with booking stats
// @route   GET /api/vehicles/admin/stats
// @access  Private/Admin
exports.getAdminVehicleStats = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });

    // Get booking stats for each vehicle
    const vehiclesWithStats = await Promise.all(
      vehicles.map(async (vehicle) => {
        const totalBookings = await Booking.countDocuments({ vehicle: vehicle._id });
        const activeBookings = await Booking.countDocuments({ 
          vehicle: vehicle._id, 
          status: { $in: ['pending', 'confirmed'] } 
        });
        const completedBookings = await Booking.countDocuments({ 
          vehicle: vehicle._id, 
          status: 'completed' 
        });

        // Calculate total revenue from this vehicle
        const revenueData = await Booking.aggregate([
          { $match: { vehicle: vehicle._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const revenue = revenueData.length > 0 ? revenueData[0].total : 0;

        return {
          ...vehicle.toObject(),
          stats: {
            totalBookings,
            activeBookings,
            completedBookings,
            revenue,
          },
        };
      })
    );

    res.json(vehiclesWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle booking history (Admin)
// @route   GET /api/vehicles/:id/bookings
// @access  Private/Admin
exports.getVehicleBookings = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const bookings = await Booking.find({ vehicle: req.params.id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      vehicle,
      bookings,
      totalBookings: bookings.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
