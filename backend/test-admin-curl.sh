#!/bin/bash

echo "================================"
echo "Admin API Testing with curl"
echo "================================"
echo ""

# Step 1: Login as Admin
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vehiclehub.com","password":"admin123"}')

echo "Login Response: $LOGIN_RESPONSE"
echo ""

# Extract token (using basic string manipulation)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token. Exiting..."
  exit 1
fi

echo "✅ Token received: ${TOKEN:0:20}..."
echo ""

# Step 2: Get Dashboard Stats
echo "2. Getting dashboard statistics..."
curl -s -X GET http://localhost:5000/api/bookings/admin/stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | json_pp
echo ""

# Step 3: Get All Users
echo "3. Getting all users..."
curl -s -X GET http://localhost:5000/api/bookings/admin/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | json_pp
echo ""

# Step 4: Get All Bookings
echo "4. Getting all bookings..."
BOOKINGS=$(curl -s -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")
echo "$BOOKINGS" | json_pp
echo ""

# Extract first booking ID
BOOKING_ID=$(echo $BOOKINGS | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ ! -z "$BOOKING_ID" ]; then
  echo "5. Accepting booking: $BOOKING_ID"
  curl -s -X PUT "http://localhost:5000/api/bookings/$BOOKING_ID/accept" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" | json_pp
  echo ""
fi

# Step 6: Get Vehicle Stats
echo "6. Getting vehicle statistics..."
curl -s -X GET http://localhost:5000/api/vehicles/admin/stats \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | json_pp
echo ""

echo "================================"
echo "✅ All tests completed!"
echo "================================"
