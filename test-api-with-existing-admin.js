const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Use existing admin credentials from seed data
const ADMIN_EMAIL = 'admin@vehiclebooking.com';
const ADMIN_PASSWORD = 'admin123';

const USER_EMAIL = 'john@example.com';
const USER_PASSWORD = 'password123';

let userToken = '';
let adminToken = '';
let vehicleId = '';
let bookingId = '';

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
  console.log('\n' + '='.repeat(60));
  log(`Testing: ${testName}`, 'blue');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ SUCCESS: ${message}`, 'green');
}

function logError(message, error) {
  log(`❌ ERROR: ${message}`, 'red');
  if (error.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);
  } else {
    console.log(error.message);
  }
}

// Test 1: Login Admin
async function testLoginAdmin() {
  logTest('Login Admin (Existing)');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    adminToken = response.data.token;
    logSuccess('Admin login successful');
    console.log('Admin Name:', response.data.name);
    console.log('Admin Role:', response.data.role);
    console.log('Token received:', adminToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    logError('Admin login failed', error);
    return false;
  }
}

// Test 2: Login User
async function testLoginUser() {
  logTest('Login User (Existing)');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });
    userToken = response.data.token;
    logSuccess('User login successful');
    console.log('User Name:', response.data.name);
    console.log('User Role:', response.data.role);
    console.log('Token received:', userToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    logError('User login failed', error);
    return false;
  }
}

// Test 3: Get Admin Profile
async function testGetAdminProfile() {
  logTest('Get Admin Profile');
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    logSuccess('Admin profile retrieved successfully');
    console.log('Name:', response.data.name);
    console.log('Email:', response.data.email);
    console.log('Role:', response.data.role);
    return true;
  } catch (error) {
    logError('Get admin profile failed', error);
    return false;
  }
}

// Test 4: Get User Profile
async function testGetUserProfile() {
  logTest('Get User Profile');
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('User profile retrieved successfully');
    console.log('Name:', response.data.name);
    console.log('Email:', response.data.email);
    console.log('Role:', response.data.role);
    return true;
  } catch (error) {
    logError('Get user profile failed', error);
    return false;
  }
}

// Test 5: Get All Vehicles
async function testGetAllVehicles() {
  logTest('Get All Vehicles');
  try {
    const response = await axios.get(`${BASE_URL}/vehicles`);
    logSuccess('Vehicles retrieved successfully');
    console.log('Total Vehicles:', response.data.length);
    if (response.data.length > 0) {
      const availableVehicle = response.data.find(v => v.available);
      if (availableVehicle) {
        vehicleId = availableVehicle._id;
        console.log('Found Available Vehicle:', availableVehicle.name);
      } else {
        vehicleId = response.data[0]._id;
        console.log('No available vehicles, using first:', response.data[0].name);
      }
    }
    return true;
  } catch (error) {
    logError('Get vehicles failed', error);
    return false;
  }
}

// Test 6: Create Vehicle (Admin)
async function testCreateVehicle() {
  logTest('Create Vehicle (Admin)');
  try {
    const response = await axios.post(
      `${BASE_URL}/vehicles`,
      {
        name: 'Test Car API',
        brand: 'Toyota',
        model: 'Camry',
        year: 2024,
        type: 'car',
        fuelType: 'petrol',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: 2500,
        image: 'https://example.com/car.jpg',
        description: 'Comfortable sedan for testing',
        features: ['AC', 'GPS', 'Bluetooth'],
        location: 'Mumbai',
        registrationNumber: `TEST${Date.now().toString().slice(-6)}`,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    const newVehicleId = response.data._id;
    logSuccess('Vehicle created successfully');
    console.log('Vehicle ID:', newVehicleId);
    console.log('Name:', response.data.name);
    console.log('Price/Day:', response.data.pricePerDay);
    console.log('Available:', response.data.available);
    if (response.data.available) {
      vehicleId = newVehicleId; // Use this for booking
    }
    return true;
  } catch (error) {
    logError('Create vehicle failed', error);
    return false;
  }
}

// Test 7: Get Vehicle by ID
async function testGetVehicleById() {
  logTest('Get Vehicle by ID');
  if (!vehicleId) {
    log('⚠️  Skipping: No vehicle ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/${vehicleId}`);
    logSuccess('Vehicle retrieved successfully');
    console.log('Vehicle:', response.data.name);
    console.log('Brand:', response.data.brand);
    console.log('Available:', response.data.available);
    console.log('Price/Day:', response.data.pricePerDay);
    return true;
  } catch (error) {
    logError('Get vehicle by ID failed', error);
    return false;
  }
}

// Test 8: Update Vehicle (Admin)
async function testUpdateVehicle() {
  logTest('Update Vehicle (Admin)');
  if (!vehicleId) {
    log('⚠️  Skipping: No vehicle ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.put(
      `${BASE_URL}/vehicles/${vehicleId}`,
      {
        pricePerDay: 3000,
        description: 'Updated description via API test',
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    logSuccess('Vehicle updated successfully');
    console.log('Updated Price/Day:', response.data.pricePerDay);
    console.log('Updated Description:', response.data.description);
    return true;
  } catch (error) {
    logError('Update vehicle failed', error);
    return false;
  }
}

// Test 9: Create Booking (User)
async function testCreateBooking() {
  logTest('Create Booking (User)');
  if (!vehicleId) {
    log('⚠️  Skipping: No vehicle ID available', 'yellow');
    return true;
  }
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 6);

    const response = await axios.post(
      `${BASE_URL}/bookings`,
      {
        vehicle: vehicleId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupLocation: 'Mumbai Airport Terminal 2',
        dropoffLocation: 'Mumbai Airport Terminal 2',
        additionalNotes: 'Need GPS and child seat',
        driverRequired: false,
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    bookingId = response.data._id;
    logSuccess('Booking created successfully');
    console.log('Booking ID:', bookingId);
    console.log('Total Days:', response.data.totalDays);
    console.log('Total Price:', response.data.totalPrice);
    console.log('Status:', response.data.status);
    console.log('Payment Status:', response.data.paymentStatus);
    return true;
  } catch (error) {
    logError('Create booking failed', error);
    return false;
  }
}

// Test 10: Get User Bookings
async function testGetUserBookings() {
  logTest('Get User Bookings');
  try {
    const response = await axios.get(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('User bookings retrieved successfully');
    console.log('Total Bookings:', response.data.length);
    if (response.data.length > 0) {
      console.log('Latest Booking Status:', response.data[0].status);
      if (!bookingId) bookingId = response.data[0]._id;
    }
    return true;
  } catch (error) {
    logError('Get user bookings failed', error);
    return false;
  }
}

// Test 11: Get All Bookings (Admin)
async function testGetAllBookings() {
  logTest('Get All Bookings (Admin)');
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    logSuccess('All bookings retrieved successfully');
    console.log('Total Bookings:', response.data.length);
    if (response.data.length > 0) {
      console.log('First Booking User:', response.data[0].user.name);
      console.log('First Booking Vehicle:', response.data[0].vehicle.name);
    }
    return true;
  } catch (error) {
    logError('Get all bookings failed', error);
    return false;
  }
}

// Test 12: Get Booking by ID
async function testGetBookingById() {
  logTest('Get Booking by ID');
  if (!bookingId) {
    log('⚠️  Skipping: No booking ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('Booking retrieved successfully');
    console.log('Booking Status:', response.data.status);
    console.log('Payment Status:', response.data.paymentStatus);
    console.log('Total Price:', response.data.totalPrice);
    return true;
  } catch (error) {
    logError('Get booking by ID failed', error);
    return false;
  }
}

// Test 13: Update Booking Status (Admin)
async function testUpdateBookingStatus() {
  logTest('Update Booking Status (Admin)');
  if (!bookingId) {
    log('⚠️  Skipping: No booking ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.put(
      `${BASE_URL}/bookings/${bookingId}`,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    logSuccess('Booking status updated successfully');
    console.log('Updated Status:', response.data.status);
    console.log('Updated Payment Status:', response.data.paymentStatus);
    return true;
  } catch (error) {
    logError('Update booking status failed', error);
    return false;
  }
}

// Test 14: Cancel Booking (User)
async function testCancelBooking() {
  logTest('Cancel Booking (User)');
  if (!bookingId) {
    log('⚠️  Skipping: No booking ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('Booking cancelled successfully');
    console.log('Message:', response.data.message);
    return true;
  } catch (error) {
    logError('Cancel booking failed', error);
    return false;
  }
}

// Test 15: Get Featured Vehicles
async function testGetFeaturedVehicles() {
  logTest('Get Featured Vehicles');
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/featured`);
    logSuccess('Featured vehicles retrieved successfully');
    console.log('Featured Vehicles Count:', response.data.length);
    if (response.data.length > 0) {
      console.log('Top Vehicle:', response.data[0].name);
      console.log('Rating:', response.data[0].rating);
    }
    return true;
  } catch (error) {
    logError('Get featured vehicles failed', error);
    return false;
  }
}

// Test 16: Filter Vehicles
async function testFilterVehicles() {
  logTest('Filter Vehicles (type=car, fuelType=petrol)');
  try {
    const response = await axios.get(`${BASE_URL}/vehicles?type=car&fuelType=petrol&available=true`);
    logSuccess('Filtered vehicles retrieved successfully');
    console.log('Filtered Vehicles Count:', response.data.length);
    return true;
  } catch (error) {
    logError('Filter vehicles failed', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║   VEHICLE BOOKING SYSTEM - COMPREHENSIVE API TEST         ║', 'blue');
  log('║          (Using Existing Admin & User)                    ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  console.log('\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  const tests = [
    { name: 'Login Admin', fn: testLoginAdmin },
    { name: 'Login User', fn: testLoginUser },
    { name: 'Get Admin Profile', fn: testGetAdminProfile },
    { name: 'Get User Profile', fn: testGetUserProfile },
    { name: 'Get All Vehicles', fn: testGetAllVehicles },
    { name: 'Create Vehicle (Admin)', fn: testCreateVehicle },
    { name: 'Get Vehicle by ID', fn: testGetVehicleById },
    { name: 'Update Vehicle (Admin)', fn: testUpdateVehicle },
    { name: 'Create Booking (User)', fn: testCreateBooking },
    { name: 'Get User Bookings', fn: testGetUserBookings },
    { name: 'Get All Bookings (Admin)', fn: testGetAllBookings },
    { name: 'Get Booking by ID', fn: testGetBookingById },
    { name: 'Update Booking Status (Admin)', fn: testUpdateBookingStatus },
    { name: 'Cancel Booking (User)', fn: testCancelBooking },
    { name: 'Get Featured Vehicles', fn: testGetFeaturedVehicles },
    { name: 'Filter Vehicles', fn: testFilterVehicles },
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // Summary
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║                    TEST SUMMARY                            ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  console.log('\n');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(
    `Success Rate: ${((results.passed / results.total) * 100).toFixed(2)}%`,
    results.failed === 0 ? 'green' : 'yellow'
  );
  console.log('\n');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED! 🎉', 'green');
    log('✅ Backend APIs are working correctly', 'green');
    log('✅ Admin operations functional', 'green');
    log('✅ User operations functional', 'green');
    log('✅ Booking system operational', 'green');
  } else {
    log('⚠️  SOME TESTS FAILED - CHECK LOGS ABOVE', 'yellow');
  }
  console.log('\n');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000');
    log('✅ Backend server is running on port 5000', 'green');
    return true;
  } catch (error) {
    log('❌ Backend server is not running on port 5000', 'red');
    log('Please start the backend server with: cd backend && npm start', 'yellow');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
})();
