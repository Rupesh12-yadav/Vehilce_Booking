# Database Seeding Instructions

## Overview
The seed file populates your MongoDB database with sample data for testing and development purposes.

## What Gets Seeded

### 1. Users (4 accounts)
- **Admin Account**
  - Email: `admin@vehiclehub.com`
  - Password: `admin123`
  - Role: Admin
  
- **User Accounts**
  - John Doe: `john@example.com` / `john123`
  - Jane Smith: `jane@example.com` / `jane123`
  - Mike Johnson: `mike@example.com` / `mike123`

### 2. Vehicles (12 vehicles)
- **Cars**: Honda City, Maruti Swift Dzire, BMW 3 Series, Mercedes E-Class, Tata Nexon EV
- **SUVs**: Hyundai Creta, Toyota Fortuner, Mahindra Thar
- **Bikes**: Royal Enfield Classic 350, Honda Activa 6G, KTM Duke 390, Yamaha R15 V4

Each vehicle includes:
- Complete specifications (type, fuel, transmission, seats)
- Pricing information
- High-quality images (Unsplash)
- Features list
- Location details
- Registration numbers
- Ratings

### 3. Bookings (3 sample bookings)
- Active booking (BMW 3 Series - John Doe)
- Completed bookings (Hyundai Creta - Jane Smith, Toyota Fortuner - Mike Johnson)

## How to Run

### Step 1: Ensure MongoDB is Running
Make sure your MongoDB server is running and the connection string in `.env` is correct.

### Step 2: Navigate to Backend Directory
```bash
cd backend
```

### Step 3: Run the Seed Script
```bash
npm run seed
```

Or directly:
```bash
node seed.js
```

## What Happens When You Seed

1. **Clears Existing Data**: All existing users, vehicles, and bookings are deleted
2. **Creates Users**: 4 users with hashed passwords
3. **Creates Vehicles**: 12 vehicles with complete details
4. **Creates Bookings**: 3 sample bookings
5. **Updates Availability**: Sets BMW 3 Series as unavailable (booked)

## Output
After successful seeding, you'll see:
```
✅ MongoDB Connected for seeding
🗑️  Clearing existing data...
✅ Existing data cleared
👥 Creating users...
✅ Created 4 users
🚗 Creating vehicles...
✅ Created 12 vehicles
📅 Creating sample bookings...
✅ Created 3 bookings

🎉 Database seeded successfully!

📝 Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin Account:
  Email: admin@vehiclehub.com
  Password: admin123

User Accounts:
  Email: john@example.com | Password: john123
  Email: jane@example.com | Password: jane123
  Email: mike@example.com | Password: mike123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Testing the Application

### As Admin
1. Login with `admin@vehiclehub.com` / `admin123`
2. Access Admin Dashboard
3. Add, edit, or delete vehicles
4. Manage all bookings

### As User
1. Login with any user account
2. Browse vehicles
3. Make bookings
4. View your bookings
5. Update profile

## Important Notes

⚠️ **Warning**: Running the seed script will **DELETE ALL EXISTING DATA** in your database.

✅ **Best Practice**: Only run this on development/testing databases, never on production.

🔄 **Re-seeding**: You can run the seed script multiple times. Each time it will clear and recreate all data.

## Troubleshooting

### Connection Error
If you see a MongoDB connection error:
- Check if MongoDB is running
- Verify the `MONGO_URI` in your `.env` file
- Ensure the database name is correct

### Module Not Found
If you see module errors:
- Run `npm install` in the backend directory
- Ensure all dependencies are installed

### Permission Error
If you see permission errors:
- Check MongoDB user permissions
- Verify your MongoDB connection string includes credentials

## Vehicle Images
All vehicle images are sourced from Unsplash and are high-quality, royalty-free images. The URLs are direct links that will work in your application.

## Customization
To add more data or modify existing data:
1. Open `seed.js`
2. Edit the `users`, `vehicles`, or `bookings` arrays
3. Run `npm run seed` again

## Data Structure

### User Schema
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  address: String,
  drivingLicense: String,
  role: 'user' | 'admin'
}
```

### Vehicle Schema
```javascript
{
  name: String,
  brand: String,
  model: String,
  year: Number,
  type: 'car' | 'bike' | 'suv' | 'van' | 'truck',
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid',
  transmission: 'manual' | 'automatic',
  seats: Number,
  pricePerDay: Number,
  image: String (URL),
  description: String,
  features: [String],
  location: String,
  registrationNumber: String,
  available: Boolean,
  rating: Number
}
```

### Booking Schema
```javascript
{
  user: ObjectId (ref: User),
  vehicle: ObjectId (ref: Vehicle),
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  status: 'pending' | 'active' | 'completed' | 'cancelled'
}
```

## Next Steps
After seeding:
1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Login with any of the seeded accounts
4. Explore the application with real data!
