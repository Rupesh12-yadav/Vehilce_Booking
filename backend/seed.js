const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');

// Connect to MongoDB
mongoose.connect("mongodb+srv://Rupesh_yadav_12:Rupesh_yadav_12@cluster0.te3iv0m.mongodb.net/vehicleBooking")
  .then(() => console.log('✅ MongoDB Connected for seeding'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@vehiclehub.com',
    password: 'admin123',
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra, India',
    drivingLicense: 'MH01DL123456',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    phone: '+91 9876543211',
    address: 'Pune, Maharashtra, India',
    drivingLicense: 'MH02DL234567',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    phone: '+91 9876543212',
    address: 'Delhi, India',
    drivingLicense: 'DL01DL345678',
    role: 'user'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'mike123',
    phone: '+91 9876543213',
    address: 'Bangalore, Karnataka, India',
    drivingLicense: 'KA01DL456789',
    role: 'user'
  }
];

// Sample Vehicles
const vehicles = [
  {
    name: 'Honda City Premium',
    brand: 'Honda',
    model: 'City',
    year: 2023,
    type: 'car',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    description: 'Experience luxury and comfort with the Honda City Premium. Perfect for city drives and long journeys with advanced features and spacious interiors.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Parking Sensors'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01AB1234',
    available: true,
    rating: 4.8
  },
  {
    name: 'Maruti Swift Dzire',
    brand: 'Maruti',
    model: 'Swift Dzire',
    year: 2022,
    type: 'car',
    fuelType: 'petrol',
    transmission: 'manual',
    seats: 5,
    pricePerDay: 1800,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
    description: 'Affordable and reliable sedan perfect for daily commutes. Fuel-efficient with comfortable seating for the whole family.',
    features: ['AC', 'Music System', 'Power Windows', 'Central Locking'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01CD5678',
    available: true,
    rating: 4.5
  },
  {
    name: 'Hyundai Creta SX',
    brand: 'Hyundai',
    model: 'Creta',
    year: 2023,
    type: 'suv',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 7,
    pricePerDay: 3500,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    description: 'Premium SUV with powerful performance and spacious interiors. Ideal for family trips and off-road adventures.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Cruise Control', '360 Camera'],
    location: 'Pune, Maharashtra',
    registrationNumber: 'MH12EF9012',
    available: true,
    rating: 4.9
  },
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    model: 'Classic 350',
    year: 2023,
    type: 'bike',
    fuelType: 'petrol',
    transmission: 'manual',
    seats: 2,
    pricePerDay: 800,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
    description: 'Iconic motorcycle with classic styling and powerful engine. Perfect for solo rides and weekend getaways.',
    features: ['Digital Speedometer', 'LED Lights', 'Disc Brakes', 'USB Charging'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01GH3456',
    available: true,
    rating: 4.7
  },
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    model: 'Activa 6G',
    year: 2023,
    type: 'bike',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 2,
    pricePerDay: 400,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
    description: 'Most popular scooter in India. Fuel-efficient, comfortable, and perfect for city commutes.',
    features: ['Digital Meter', 'LED Lights', 'Mobile Charging', 'Under Seat Storage'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01IJ7890',
    available: true,
    rating: 4.6
  },
  {
    name: 'Toyota Fortuner',
    brand: 'Toyota',
    model: 'Fortuner',
    year: 2023,
    type: 'suv',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 7,
    pricePerDay: 5000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    description: 'Premium luxury SUV with powerful performance. Perfect for long trips and special occasions.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Cruise Control', '4WD', 'Hill Assist'],
    location: 'Delhi, India',
    registrationNumber: 'DL01KL1234',
    available: true,
    rating: 4.9
  },
  {
    name: 'Mahindra Thar',
    brand: 'Mahindra',
    model: 'Thar',
    year: 2022,
    type: 'suv',
    fuelType: 'diesel',
    transmission: 'manual',
    seats: 4,
    pricePerDay: 3000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    description: 'Rugged off-road SUV perfect for adventure enthusiasts. Built for tough terrains and outdoor expeditions.',
    features: ['AC', 'Music System', '4WD', 'Roll Cage', 'Off-road Tires'],
    location: 'Bangalore, Karnataka',
    registrationNumber: 'KA01MN5678',
    available: true,
    rating: 4.8
  },
  {
    name: 'BMW 3 Series',
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    type: 'car',
    fuelType: 'petrol',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 8000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    description: 'Luxury sedan with premium features and powerful performance. Experience the ultimate driving pleasure.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Sunroof', 'Leather Seats', 'Cruise Control', 'Premium Sound System', 'Ambient Lighting'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01OP9012',
    available: false,
    rating: 5.0
  },
  {
    name: 'Mercedes-Benz E-Class',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    type: 'car',
    fuelType: 'diesel',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 10000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    description: 'Ultimate luxury sedan with cutting-edge technology. Perfect for business meetings and special events.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Panoramic Sunroof', 'Leather Seats', 'Massage Seats', 'Premium Sound System', 'Ambient Lighting', 'Adaptive Cruise Control'],
    location: 'Delhi, India',
    registrationNumber: 'DL01QR3456',
    available: true,
    rating: 5.0
  },
  {
    name: 'Tata Nexon EV',
    brand: 'Tata',
    model: 'Nexon EV',
    year: 2023,
    type: 'suv',
    fuelType: 'electric',
    transmission: 'automatic',
    seats: 5,
    pricePerDay: 2800,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800',
    description: 'India\'s most popular electric SUV. Zero emissions, low running cost, and modern features.',
    features: ['AC', 'GPS Navigation', 'Bluetooth', 'Sunroof', 'Fast Charging', 'Regenerative Braking', 'Digital Cluster'],
    location: 'Pune, Maharashtra',
    registrationNumber: 'MH12ST7890',
    available: true,
    rating: 4.7
  },
  {
    name: 'KTM Duke 390',
    brand: 'KTM',
    model: 'Duke 390',
    year: 2023,
    type: 'bike',
    fuelType: 'petrol',
    transmission: 'manual',
    seats: 2,
    pricePerDay: 1200,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
    description: 'High-performance street bike with aggressive styling. Perfect for thrill-seekers and speed enthusiasts.',
    features: ['Digital Display', 'LED Lights', 'ABS', 'Slipper Clutch', 'Quick Shifter'],
    location: 'Bangalore, Karnataka',
    registrationNumber: 'KA01UV1234',
    available: true,
    rating: 4.8
  },
  {
    name: 'Yamaha R15 V4',
    brand: 'Yamaha',
    model: 'R15 V4',
    year: 2023,
    type: 'bike',
    fuelType: 'petrol',
    transmission: 'manual',
    seats: 2,
    pricePerDay: 1000,
    image: 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800',
    description: 'Sporty bike with racing DNA. Aerodynamic design and powerful engine for track-like performance.',
    features: ['Digital Display', 'LED Lights', 'ABS', 'Dual Channel ABS', 'Quick Shifter'],
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01WX5678',
    available: true,
    rating: 4.7
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    console.log('✅ Existing data cleared');

    // Hash passwords and create users
    console.log('👥 Creating users...');
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create vehicles
    console.log('🚗 Creating vehicles...');
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`✅ Created ${createdVehicles.length} vehicles`);

    // Create sample bookings
    console.log('📅 Creating sample bookings...');
    const bookings = [
      {
        user: createdUsers[1]._id, // John Doe
        vehicle: createdVehicles[7]._id, // BMW 3 Series (not available)
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-20'),
        totalDays: 5,
        totalPrice: 40000,
        status: 'confirmed',
        paymentStatus: 'paid',
        pickupLocation: 'Mumbai Airport, Terminal 2',
        dropoffLocation: 'Mumbai Airport, Terminal 2',
        driverRequired: false
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        vehicle: createdVehicles[2]._id, // Hyundai Creta
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-01-15'),
        totalDays: 5,
        totalPrice: 17500,
        status: 'completed',
        paymentStatus: 'paid',
        pickupLocation: 'Pune Railway Station',
        dropoffLocation: 'Pune Railway Station',
        driverRequired: true
      },
      {
        user: createdUsers[3]._id, // Mike Johnson
        vehicle: createdVehicles[5]._id, // Toyota Fortuner
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-25'),
        totalDays: 5,
        totalPrice: 25000,
        status: 'completed',
        paymentStatus: 'paid',
        pickupLocation: 'Delhi IGI Airport',
        dropoffLocation: 'Delhi IGI Airport',
        driverRequired: false
      }
    ];
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ Created ${createdBookings.length} bookings`);

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(createdVehicles[7]._id, { available: false });

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Email: admin@vehiclehub.com');
    console.log('  Password: admin123');
    console.log('\nUser Accounts:');
    console.log('  Email: john@example.com | Password: john123');
    console.log('  Email: jane@example.com | Password: jane123');
    console.log('  Email: mike@example.com | Password: mike123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
