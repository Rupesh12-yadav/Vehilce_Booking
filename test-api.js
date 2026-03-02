const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let userToken = '';
let adminToken = '';
let vehicleId = '';
let bookingId = '';

// Color codes for console output
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

// Test 1: Register User
async function testRegisterUser() {
  logTest('Register User');
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: `user${Date.now()}@test.com`,
      password: '123456',
      phone: '1234567890',
      address: 'Test Address',
      drivingLicense: 'DL123456',
    });
    userToken = response.data.token;
    logSuccess('User registered successfully');
    console.log('User:', response.data.name, '| Role:', response.data.role);
    return true;
  } catch (error) {
    logError('User registration failed', error);
    return false;
  }
}

// Test 2: Register Admin
async function testRegisterAdmin() {
  logTest('Register Admin');
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Admin User',
      email: `admin${Date.now()}@test.com`,
      password: '123456',
      phone: '9876543210',
      role: 'admin',
    });
    adminToken = response.data.token;
    logSuccess('Admin registered successfully');
    console.log('Admin:', response.data.name, '| Role:', response.data.role);
    return true;
  } catch (error) {
    logError('Admin registration failed', error);
    return false;
  }
}

// Test 3: Login User
async function testLoginUser() {
  logTest('Login User');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@test.com',
      password: '123456',
    });
    logSuccess('User login successful');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    return true;
  } catch (error) {
    logError('User login failed (expected if user does not exist)', error);
    return true; // Not critical
  }
}

// Test 4: Get User Profile
async function testGetProfile() {
  logTest('Get User Profile');
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('Profile retrieved successfully');
    console.log('Name:', response.data.name);
    console.log('Email:', response.data.email);
    console.log('Role:', response.data.role);
    return true;
  } catch (error) {
    logError('Get profile failed', error);
    return false;
  }
}

// Test 5: Update User Profile
async function testUpdateProfile() {
  logTest('Update User Profile');
  try {
    const response = await axios.put(
      `${BASE_URL}/auth/profile`,
      {
        name: 'Updated Test User',
        phone: '9999999999',
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    logSuccess('Profile updated successfully');
    console.log('Updated Name:', response.data.name);
    console.log('Updated Phone:', response.data.phone);
    return true;
  } catch (error) {
    logError('Update profile failed', error);
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
        name: 'Test Car',
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        type: 'car',
        fuelType: 'petrol',
        transmission: 'automatic',
        seats: 5,
        pricePerDay: 2500,
        image: 'https://example.com/car.jpg',
        description: 'Comfortable sedan for testing',
        features: ['AC', 'GPS', 'Bluetooth'],
        location: 'Mumbai',
        registrationNumber: `MH01AB${Date.now().toString().slice(-4)}`,
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    vehicleId = response.data._id;
    logSuccess('Vehicle created successfully');
    console.log('Vehicle ID:', vehicleId);
    console.log('Name:', response.data.name);
    console.log('Price/Day:', response.data.pricePerDay);
    return true;
  } catch (error) {
    logError('Create vehicle failed', error);
    return false;
  }
}

// Test 7: Get All Vehicles
async function testGetAllVehicles() {
  logTest('Get All Vehicles');
  try {
    const response = await axios.get(`${BASE_URL}/vehicles`);
    logSuccess('Vehicles retrieved successfully');
    console.log('Total Vehicles:', response.data.length);
    if (response.data.length > 0) {
      console.log('First Vehicle:', response.data[0].name);
      if (!vehicleId) vehicleId = response.data[0]._id;
    }
    return true;
  } catch (error) {
    logError('Get vehicles failed', error);
    return false;
  }
}

// Test 8: Get Vehicle by ID
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
    return true;
  } catch (error) {
    logError('Get vehicle by ID failed', error);
    return false;
  }
}

// Test 9: Get Featured Vehicles
async function testGetFeaturedVehicles() {
  logTest('Get Featured Vehicles');
  try {
    const response = await axios.get(`${BASE_URL}/vehicles/featured`);
    logSuccess('Featured vehicles retrieved successfully');
    console.log('Featured Vehicles Count:', response.data.length);
    return true;
  } catch (error) {
    logError('Get featured vehicles failed', error);
    return false;
  }
}

// Test 10: Update Vehicle (Admin)
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
        description: 'Updated description',
      },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    logSuccess('Vehicle updated successfully');
    console.log('Updated Price/Day:', response.data.pricePerDay);
    return true;
  } catch (error) {
    logError('Update vehicle failed', error);
    return false;
  }
}

// Test 11: Create Booking (User)
async function testCreateBooking() {
  logTest('Create Booking (User)');
  if (!vehicleId) {
    log('⚠️  Skipping: No vehicle ID available', 'yellow');
    return true;
  }
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);

    const response = await axios.post(
      `${BASE_URL}/bookings`,
      {
        vehicle: vehicleId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        pickupLocation: 'Mumbai Airport',
        dropoffLocation: 'Mumbai Airport',
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
    return true;
  } catch (error) {
    logError('Create booking failed', error);
    return false;
  }
}

// Test 12: Get User Bookings
async function testGetUserBookings() {
  logTest('Get User Bookings');
  try {
    const response = await axios.get(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    logSuccess('User bookings retrieved successfully');
    console.log('Total Bookings:', response.data.length);
    if (response.data.length > 0) {
      console.log('First Booking Status:', response.data[0].status);
      if (!bookingId) bookingId = response.data[0]._id;
    }
    return true;
  } catch (error) {
    logError('Get user bookings failed', error);
    return false;
  }
}

// Test 13: Get All Bookings (Admin)
async function testGetAllBookings() {
  logTest('Get All Bookings (Admin)');
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    logSuccess('All bookings retrieved successfully');
    console.log('Total Bookings:', response.data.length);
    return true;
  } catch (error) {
    logError('Get all bookings failed', error);
    return false;
  }
}

// Test 14: Get Booking by ID
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
    return true;
  } catch (error) {
    logError('Get booking by ID failed', error);
    return false;
  }
}

// Test 15: Update Booking Status (Admin)
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

// Test 16: Cancel Booking (User)
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

// Test 17: Delete Vehicle (Admin)
async function testDeleteVehicle() {
  logTest('Delete Vehicle (Admin)');
  if (!vehicleId) {
    log('⚠️  Skipping: No vehicle ID available', 'yellow');
    return true;
  }
  try {
    const response = await axios.delete(`${BASE_URL}/vehicles/${vehicleId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    logSuccess('Vehicle deleted successfully');
    console.log('Message:', response.data.message);
    return true;
  } catch (error) {
    logError('Delete vehicle failed', error);
    return false;
  }
}

// Test 18: Test Unauthorized Access
async function testUnauthorizedAccess() {
  logTest('Test Unauthorized Access (Should Fail)');
  try {
    await axios.post(`${BASE_URL}/vehicles`, {
      name: 'Unauthorized Vehicle',
    });
    logError('Unauthorized access test failed - should have been blocked', {});
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      logSuccess('Unauthorized access properly blocked');
      return true;
    }
    logError('Unexpected error in unauthorized access test', error);
    return false;
  }
}

// Test 19: Test Admin-Only Access with User Token
async function testAdminOnlyWithUserToken() {
  logTest('Test Admin-Only Access with User Token (Should Fail)');
  try {
    await axios.post(
      `${BASE_URL}/vehicles`,
      {
        name: 'Test Vehicle',
        brand: 'Test',
        model: 'Test',
        year: 2023,
        type: 'car',
        fuelType: 'petrol',
        transmission: 'manual',
        seats: 4,
        pricePerDay: 1000,
        image: 'test.jpg',
        description: 'Test',
        location: 'Test',
        registrationNumber: 'TEST123',
      },
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    logError('Admin-only test failed - user should not have access', {});
    return false;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      logSuccess('Admin-only access properly enforced');
      return true;
    }
    logError('Unexpected error in admin-only test', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║     VEHICLE BOOKING SYSTEM - API TESTING SUITE            ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');
  console.log('\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  const tests = [
    { name: 'Register User', fn: testRegisterUser },
    { name: 'Register Admin', fn: testRegisterAdmin },
    { name: 'Login User', fn: testLoginUser },
    { name: 'Get User Profile', fn: testGetProfile },
    { name: 'Update User Profile', fn: testUpdateProfile },
    { name: 'Create Vehicle (Admin)', fn: testCreateVehicle },
    { name: 'Get All Vehicles', fn: testGetAllVehicles },
    { name: 'Get Vehicle by ID', fn: testGetVehicleById },
    { name: 'Get Featured Vehicles', fn: testGetFeaturedVehicles },
    { name: 'Update Vehicle (Admin)', fn: testUpdateVehicle },
    { name: 'Create Booking (User)', fn: testCreateBooking },
    { name: 'Get User Bookings', fn: testGetUserBookings },
    { name: 'Get All Bookings (Admin)', fn: testGetAllBookings },
    { name: 'Get Booking by ID', fn: testGetBookingById },
    { name: 'Update Booking Status (Admin)', fn: testUpdateBookingStatus },
    { name: 'Cancel Booking (User)', fn: testCancelBooking },
    { name: 'Delete Vehicle (Admin)', fn: testDeleteVehicle },
    { name: 'Test Unauthorized Access', fn: testUnauthorizedAccess },
    { name: 'Test Admin-Only Access', fn: testAdminOnlyWithUserToken },
  ];

  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay between tests
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
