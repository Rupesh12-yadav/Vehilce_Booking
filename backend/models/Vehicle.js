const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a vehicle name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add a brand'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please add a model'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please add a year'],
    },
    type: {
      type: String,
      required: [true, 'Please add a vehicle type'],
      enum: ['car', 'bike', 'suv', 'van', 'truck'],
    },
    fuelType: {
      type: String,
      required: [true, 'Please add fuel type'],
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    },
    transmission: {
      type: String,
      required: [true, 'Please add transmission type'],
      enum: ['manual', 'automatic'],
    },
    seats: {
      type: Number,
      required: [true, 'Please add number of seats'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Please add price per day'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    features: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please add registration number'],
      unique: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
