/**
 * Admin API Testing Script
 * Tests all admin-specific endpoints for the Vehicle Rental Management System
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Admin credentials (use existing admin or create one)
const ADMIN_CREDENTIALS = {
  email: 'admin@vehiclehub.com',
  password: 'admin123',
};

let adminToken = '';
let testUserId = '';
let testVehicleId = '';
let testBookingId = '';

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return { success: true, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test 1: Admin Login
async function testAdminLogin() {
  console.log('\n📝 Test 1: Admin Login');
  console.log('='.repeat(50));
  
  const result = await apiCall('/auth/login', 'POST', ADMIN_CREDENTIALS);
  
  if (result.success) {
    adminToken = result.data.token;
    console.log('✅ Admin login successful');
    console.log(`Token: ${adminToken.substring(0, 20)}...`);
    console.log(`Admin Name: ${result.data.name}`);
    console.log(`Admin Role: ${result.data.role}`);
    return true;
  } else {
    console.log('❌ Admin login failed:', result.error);
    return false;
  }
}

// Test 2: Get Dashboard Statistics
async function testDashboardStats() {
  console.log('\n📊 Test 2: Get Dashboard Statistics');
  console.log('='.repeat(50));
  
  const result = await apiCall('/bookings/admin/stats', 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ Dashboard stats retrieved successfully');
    console.log('\nBookings Summary:');
    console.log(`  Total: ${result.data.bookings.total}`);
    console.log(`  Pending: ${result.data.bookings.pending}`);
    console.log(`  Confirmed: ${result.data.bookings.confirmed}`);
    console.log(`  Cancelled: ${result.data.bookings.cancelled}`);
    console.log(`  Completed: ${result.data.bookings.completed}`);
    
    console.log('\nVehicles Summary:');
    console.log(`  Total: ${result.data.vehicles.total}`);
    console.log(`  Available: ${result.data.vehicles.available}`);
    console.log(`  Booked: ${result.data.vehicles.booked}`);
    
    console.log('\nRevenue:');
    console.log(`  Total: ₹${result.data.revenue.total}`);
    
    console.log('\nUsers:');
    console.log(`  Total: ${result.data.users.total}`);
    
    console.log('\nRecent Bookings:', result.data.recentBookings.length);
    return true;
  } else {
    console.log('❌ Failed to get dashboard stats:', result.error);
    return false;
  }
}

// Test 3: Get All Users
async function testGetAllUsers() {
  console.log('\n👥 Test 3: Get All Users');
  console.log('='.repeat(50));
  
  const result = await apiCall('/bookings/admin/users', 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ Users retrieved successfully');
    console.log(`Total Users: ${result.data.length}`);
    
    if (result.data.length > 0) {
      testUserId = result.data[0]._id;
      console.log('\nFirst User:');
      console.log(`  ID: ${result.data[0]._id}`);
      console.log(`  Name: ${result.data[0].name}`);
      console.log(`  Email: ${result.data[0].email}`);
      console.log(`  Phone: ${result.data[0].phone}`);
      console.log(`  Booking Count: ${result.data[0].bookingCount}`);
    }
    return true;
  } else {
    console.log('❌ Failed to get users:', result.error);
    return false;
  }
}

// Test 4: Get User-Specific Bookings
async function testGetUserBookings() {
  console.log('\n📋 Test 4: Get User-Specific Bookings');
  console.log('='.repeat(50));
  
  if (!testUserId) {
    console.log('⚠️  No test user ID available, skipping...');
    return false;
  }
  
  const result = await apiCall(`/bookings/admin/user/${testUserId}`, 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ User bookings retrieved successfully');
    console.log(`\nUser: ${result.data.user.name}`);
    console.log(`Email: ${result.data.user.email}`);
    console.log(`Total Bookings: ${result.data.totalBookings}`);
    
    if (result.data.bookings.length > 0) {
      console.log('\nFirst Booking:');
      const booking = result.data.bookings[0];
      console.log(`  ID: ${booking._id}`);
      console.log(`  Vehicle: ${booking.vehicle.name}`);
      console.log(`  Status: ${booking.status}`);
      console.log(`  Total Price: ₹${booking.totalPrice}`);
    }
    return true;
  } else {
    console.log('❌ Failed to get user bookings:', result.error);
    return false;
  }
}

// Test 5: Get All Bookings
async function testGetAllBookings() {
  console.log('\n📚 Test 5: Get All Bookings');
  console.log('='.repeat(50));
  
  const result = await apiCall('/bookings', 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ All bookings retrieved successfully');
    console.log(`Total Bookings: ${result.data.length}`);
    
    if (result.data.length > 0) {
      testBookingId = result.data[0]._id;
      console.log('\nFirst Booking:');
      console.log(`  ID: ${result.data[0]._id}`);
      console.log(`  User: ${result.data[0].user.name}`);
      console.log(`  Vehicle: ${result.data[0].vehicle.name}`);
      console.log(`  Status: ${result.data[0].status}`);
      console.log(`  Total Price: ₹${result.data[0].totalPrice}`);
      console.log(`  Start Date: ${new Date(result.data[0].startDate).toLocaleDateString()}`);
      console.log(`  End Date: ${new Date(result.data[0].endDate).toLocaleDateString()}`);
    }
    return true;
  } else {
    console.log('❌ Failed to get all bookings:', result.error);
    return false;
  }
}

// Test 6: Accept Booking
async function testAcceptBooking() {
  console.log('\n✅ Test 6: Accept Booking');
  console.log('='.repeat(50));
  
  if (!testBookingId) {
    console.log('⚠️  No test booking ID available, skipping...');
    return false;
  }
  
  const result = await apiCall(`/bookings/${testBookingId}/accept`, 'PUT', null, adminToken);
  
  if (result.success) {
    console.log('✅ Booking accepted successfully');
    console.log(`Message: ${result.data.message}`);
    console.log(`Booking ID: ${result.data.booking._id}`);
    console.log(`New Status: ${result.data.booking.status}`);
    console.log(`User: ${result.data.booking.user.name}`);
    console.log(`Vehicle: ${result.data.booking.vehicle.name}`);
    return true;
  } else {
    console.log('❌ Failed to accept booking:', result.error);
    return false;
  }
}

// Test 7: Get Vehicle Statistics
async function testVehicleStats() {
  console.log('\n🚗 Test 7: Get Vehicle Statistics');
  console.log('='.repeat(50));
  
  const result = await apiCall('/vehicles/admin/stats', 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ Vehicle statistics retrieved successfully');
    console.log(`Total Vehicles: ${result.data.length}`);
    
    if (result.data.length > 0) {
      testVehicleId = result.data[0]._id;
      console.log('\nFirst Vehicle:');
      const vehicle = result.data[0];
      console.log(`  ID: ${vehicle._id}`);
      console.log(`  Name: ${vehicle.name}`);
      console.log(`  Brand: ${vehicle.brand}`);
      console.log(`  Model: ${vehicle.model}`);
      console.log(`  Price/Day: ₹${vehicle.pricePerDay}`);
      console.log(`  Available: ${vehicle.available}`);
      console.log('\n  Statistics:');
      console.log(`    Total Bookings: ${vehicle.stats.totalBookings}`);
      console.log(`    Active Bookings: ${vehicle.stats.activeBookings}`);
      console.log(`    Completed Bookings: ${vehicle.stats.completedBookings}`);
      console.log(`    Revenue: ₹${vehicle.stats.revenue}`);
    }
    return true;
  } else {
    console.log('❌ Failed to get vehicle stats:', result.error);
    return false;
  }
}

// Test 8: Get Vehicle Booking History
async function testVehicleBookingHistory() {
  console.log('\n📖 Test 8: Get Vehicle Booking History');
  console.log('='.repeat(50));
  
  if (!testVehicleId) {
    console.log('⚠️  No test vehicle ID available, skipping...');
    return false;
  }
  
  const result = await apiCall(`/vehicles/${testVehicleId}/bookings`, 'GET', null, adminToken);
  
  if (result.success) {
    console.log('✅ Vehicle booking history retrieved successfully');
    console.log(`\nVehicle: ${result.data.vehicle.name}`);
    console.log(`Brand: ${result.data.vehicle.brand}`);
    console.log(`Model: ${result.data.vehicle.model}`);
    console.log(`Total Bookings: ${result.data.totalBookings}`);
    
    if (result.data.bookings.length > 0) {
      console.log('\nRecent Bookings:');
      result.data.bookings.slice(0, 3).forEach((booking, index) => {
        console.log(`\n  ${index + 1}. Booking ID: ${booking._id}`);
        console.log(`     User: ${booking.user.name}`);
        console.log(`     Status: ${booking.status}`);
        console.log(`     Price: ₹${booking.totalPrice}`);
      });
    }
    return true;
  } else {
    console.log('❌ Failed to get vehicle booking history:', result.error);
    return false;
  }
}

// Test 9: Update Booking Status
async function testUpdateBookingStatus() {
  console.log('\n🔄 Test 9: Update Booking Status');
  console.log('='.repeat(50));
  
  if (!testBookingId) {
    console.log('⚠️  No test booking ID available, skipping...');
    return false;
  }
  
  const updateData = {
    status: 'completed',
    paymentStatus: 'paid'
  };
  
  const result = await apiCall(`/bookings/${testBookingId}`, 'PUT', updateData, adminToken);
  
  if (result.success) {
    console.log('✅ Booking status updated successfully');
    console.log(`Booking ID: ${result.data._id}`);
    console.log(`New Status: ${result.data.status}`);
    console.log(`Payment Status: ${result.data.paymentStatus}`);
    console.log(`User: ${result.data.user.name}`);
    console.log(`Vehicle: ${result.data.vehicle.name}`);
    return true;
  } else {
    console.log('❌ Failed to update booking status:', result.error);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 ADMIN API TESTING SUITE');
  console.log('='.repeat(50));
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Admin Email: ${ADMIN_CREDENTIALS.email}`);
  
  const tests = [
    { name: 'Admin Login', fn: testAdminLogin },
    { name: 'Dashboard Statistics', fn: testDashboardStats },
    { name: 'Get All Users', fn: testGetAllUsers },
    { name: 'Get User Bookings', fn: testGetUserBookings },
    { name: 'Get All Bookings', fn: testGetAllBookings },
    { name: 'Accept Booking', fn: testAcceptBooking },
    { name: 'Vehicle Statistics', fn: testVehicleStats },
    { name: 'Vehicle Booking History', fn: testVehicleBookingHistory },
    { name: 'Update Booking Status', fn: testUpdateBookingStatus },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test "${test.name}" threw an error:`, error.message);
      failed++;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${tests.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / tests.length) * 100).toFixed(2)}%`);
  console.log('='.repeat(50));
}

// Run tests
runAllTests().catch(console.error);
