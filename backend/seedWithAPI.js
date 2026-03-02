const axios = require('axios');
require('dotenv').config();

// Base URL for API
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Admin credentials
const ADMIN_CREDENTIALS = {
  name: 'Admin User',
  email: 'admin@vehiclehub.com',
  password: 'admin123',
  phone: '+91 9876543210',
  address: 'Mumbai, Maharashtra, India',
  drivingLicense: 'MH01DL123456'
};

// User accounts
const USERS = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    phone: '+91 9876543211',
    address: 'Pune, Maharashtra, India',
    drivingLicense: 'MH02DL234567'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    phone: '+91 9876543212',
    address: 'Delhi, India',
    drivingLicense: 'DL01DL345678'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'mike123',
    phone: '+91 9876543213',
    address: 'Bangalore, Karnataka, India',
    drivingLicense: 'KA01DL456789'
  }
];

// Vehicles data
const VEHICLES = [
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
    features: 'AC, GPS Navigation, Bluetooth, Sunroof, Leather Seats, Parking Sensors',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01AB1234'
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
    features: 'AC, Music System, Power Windows, Central Locking',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01CD5678'
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
    features: 'AC, GPS Navigation, Bluetooth, Sunroof, Leather Seats, Cruise Control, 360 Camera',
    location: 'Pune, Maharashtra',
    registrationNumber: 'MH12EF9012'
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
    features: 'Digital Speedometer, LED Lights, Disc Brakes, USB Charging',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01GH3456'
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
    features: 'Digital Meter, LED Lights, Mobile Charging, Under Seat Storage',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01IJ7890'
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
    features: 'AC, GPS Navigation, Bluetooth, Sunroof, Leather Seats, Cruise Control, 4WD, Hill Assist',
    location: 'Delhi, India',
    registrationNumber: 'DL01KL1234'
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
    features: 'AC, Music System, 4WD, Roll Cage, Off-road Tires',
    location: 'Bangalore, Karnataka',
    registrationNumber: 'KA01MN5678'
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
    features: 'AC, GPS Navigation, Bluetooth, Sunroof, Leather Seats, Cruise Control, Premium Sound System, Ambient Lighting',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01OP9012'
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
    features: 'AC, GPS Navigation, Bluetooth, Panoramic Sunroof, Leather Seats, Massage Seats, Premium Sound System, Ambient Lighting, Adaptive Cruise Control',
    location: 'Delhi, India',
    registrationNumber: 'DL01QR3456'
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
    features: 'AC, GPS Navigation, Bluetooth, Sunroof, Fast Charging, Regenerative Braking, Digital Cluster',
    location: 'Pune, Maharashtra',
    registrationNumber: 'MH12ST7890'
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
    features: 'Digital Display, LED Lights, ABS, Slipper Clutch, Quick Shifter',
    location: 'Bangalore, Karnataka',
    registrationNumber: 'KA01UV1234'
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
    features: 'Digital Display, LED Lights, ABS, Dual Channel ABS, Quick Shifter',
    location: 'Mumbai, Maharashtra',
    registrationNumber: 'MH01WX5678'
  }
];

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Seed function
const seedWithAPI = async () => {
  try {
    console.log('🚀 Starting API-based database seeding...\n');

    // Step 1: Register Admin
    console.log('👤 Creating Admin account...');
    try {
      const adminResponse = await axios.post(`${API_URL}/auth/register`, ADMIN_CREDENTIALS);
      console.log('✅ Admin account created');
      console.log(`   Email: ${ADMIN_CREDENTIALS.email}`);
      console.log(`   Password: ${ADMIN_CREDENTIALS.password}\n`);
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  Admin account already exists\n');
      } else {
        throw error;
      }
    }

    // Step 2: Login as Admin to get token
    console.log('🔐 Logging in as Admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: ADMIN_CREDENTIALS.email,
      password: ADMIN_CREDENTIALS.password
    });
    const adminToken = loginResponse.data.token;
    console.log('✅ Admin logged in successfully\n');

    // Step 3: Create User accounts
    console.log('👥 Creating user accounts...');
    const createdUsers = [];
    for (const user of USERS) {
      try {
        await axios.post(`${API_URL}/auth/register`, user);
        createdUsers.push(user);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
        await wait(500); // Wait 500ms between requests
      } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
          console.log(`ℹ️  User already exists: ${user.email}`);
          createdUsers.push(user);
        } else {
          console.error(`❌ Error creating user ${user.email}:`, error.response?.data?.message || error.message);
        }
      }
    }
    console.log(`\n✅ Created ${createdUsers.length} user accounts\n`);

    // Step 4: Add Vehicles (as Admin)
    console.log('🚗 Adding vehicles...');
    const createdVehicles = [];
    for (const vehicle of VEHICLES) {
      try {
        const response = await axios.post(`${API_URL}/vehicles`, vehicle, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });
        createdVehicles.push(response.data);
        console.log(`✅ Added vehicle: ${vehicle.name}`);
        await wait(500); // Wait 500ms between requests
      } catch (error) {
        console.error(`❌ Error adding vehicle ${vehicle.name}:`, error.response?.data?.message || error.message);
      }
    }
    console.log(`\n✅ Added ${createdVehicles.length} vehicles\n`);

    // Step 5: Create sample bookings
    console.log('📅 Creating sample bookings...');
    
    // Login as John Doe
    try {
      const johnLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'john@example.com',
        password: 'john123'
      });
      const johnToken = johnLogin.data.token;

      // Create booking for BMW (if available)
      if (createdVehicles.length >= 8) {
        const bmwVehicle = createdVehicles[7]; // BMW 3 Series
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 5); // 5 days from now
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 10); // 10 days from now

        const bookingData = {
          vehicle: bmwVehicle._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          pickupLocation: 'Mumbai Airport, Terminal 2',
          dropoffLocation: 'Mumbai Airport, Terminal 2',
          driverRequired: false,
          additionalNotes: 'Please ensure the car is fully fueled'
        };

        await axios.post(`${API_URL}/bookings`, bookingData, {
          headers: { 'Authorization': `Bearer ${johnToken}` }
        });
        console.log('✅ Created booking: John Doe - BMW 3 Series');
      }
    } catch (error) {
      console.error('❌ Error creating John\'s booking:', error.response?.data?.message || error.message);
    }

    await wait(1000);

    // Login as Jane Smith
    try {
      const janeLogin = await axios.post(`${API_URL}/auth/login`, {
        email: 'jane@example.com',
        password: 'jane123'
      });
      const janeToken = janeLogin.data.token;

      // Create booking for Hyundai Creta (if available)
      if (createdVehicles.length >= 3) {
        const cretaVehicle = createdVehicles[2]; // Hyundai Creta
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 2);
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);

        const bookingData = {
          vehicle: cretaVehicle._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          pickupLocation: 'Pune Railway Station',
          dropoffLocation: 'Pune Railway Station',
          driverRequired: true,
          additionalNotes: 'Need experienced driver for outstation trip'
        };

        await axios.post(`${API_URL}/bookings`, bookingData, {
          headers: { 'Authorization': `Bearer ${janeToken}` }
        });
        console.log('✅ Created booking: Jane Smith - Hyundai Creta');
      }
    } catch (error) {
      console.error('❌ Error creating Jane\'s booking:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Database seeded successfully via API!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nAdmin Account:');
    console.log('  Email: admin@vehiclehub.com');
    console.log('  Password: admin123');
    console.log('\nUser Accounts:');
    console.log('  Email: john@example.com | Password: john123');
    console.log('  Email: jane@example.com | Password: jane123');
    console.log('  Email: mike@example.com | Password: mike123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.response?.data || error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend server is running (npm run dev)');
    console.error('   2. MongoDB is connected');
    console.error('   3. API_URL is correct in .env file\n');
    process.exit(1);
  }
};

// Run seed
console.log('⚠️  Make sure the backend server is running before seeding!\n');
seedWithAPI();
