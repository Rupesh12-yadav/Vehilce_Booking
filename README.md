# Vehicle Booking System

A full-stack MERN (MongoDB, Express, React, Node.js) application for vehicle rental and booking with Tailwind CSS for styling.

## Features

### User Features
- 🔐 User authentication (Register/Login)
- 🚗 Browse available vehicles with filters
- 🔍 View detailed vehicle information
- 📅 Book vehicles for specific dates
- 📋 View and manage bookings
- 👤 Update user profile
- ❌ Cancel bookings

### Admin Features
- ➕ Add new vehicles
- ✏️ Manage vehicles (edit/delete)
- 📊 View all bookings
- ✅ Confirm/Cancel bookings
- 🎯 Update booking status
- 💰 Manage payment status

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## Project Structure

```
vehicle-booking-system/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Vehicle.js            # Vehicle model
│   │   └── Booking.js            # Booking model
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── vehicleController.js  # Vehicle CRUD operations
│   │   └── bookingController.js  # Booking management
│   ├── routes/
│   │   ├── authRoutes.js         # Auth routes
│   │   ├── vehicleRoutes.js      # Vehicle routes
│   │   └── bookingRoutes.js      # Booking routes
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── .env                      # Environment variables
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── VehicleCard.jsx   # Vehicle card component
│   │   │   └── Loader.jsx        # Loading spinner
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Home page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Vehicles.jsx      # Vehicle listing
│   │   │   ├── VehicleDetails.jsx # Vehicle details
│   │   │   ├── Booking.jsx       # Booking form
│   │   │   ├── MyBookings.jsx    # User bookings
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── AdminDashboard.jsx # Admin dashboard
│   │   │   ├── AddVehicle.jsx    # Add vehicle form
│   │   │   ├── ManageVehicles.jsx # Vehicle management
│   │   │   └── ManageBookings.jsx # Booking management
│   │   ├── context/
│   │   │   └── AuthContext.js    # Authentication context
│   │   ├── services/
│   │   │   └── api.js            # Axios configuration
│   │   ├── App.js                # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/vehicle-booking
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

4. Start the backend server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Vehicle Routes
- `GET /api/vehicles` - Get all vehicles (with filters)
- `GET /api/vehicles/featured` - Get featured vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle (Admin only)
- `PUT /api/vehicles/:id` - Update vehicle (Admin only)
- `DELETE /api/vehicles/:id` - Delete vehicle (Admin only)

### Booking Routes
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get all bookings (Admin only)
- `GET /api/bookings/my-bookings` - Get user bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id` - Update booking status (Admin only)
- `DELETE /api/bookings/:id` - Cancel booking (Protected)

## Default Admin Account

To create an admin account, you need to manually update a user's role in the database:

1. Register a new user through the application
2. Connect to MongoDB and find the user
3. Update the user's role field to 'admin'

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Features in Detail

### Vehicle Filtering
- Filter by vehicle type (car, bike, SUV, van, truck)
- Filter by fuel type (petrol, diesel, electric, hybrid)
- Filter by transmission (manual, automatic)
- Filter by availability status

### Booking System
- Date-based booking
- Automatic price calculation
- Pickup and dropoff location
- Optional driver requirement
- Booking status tracking (pending, confirmed, cancelled, completed)
- Payment status tracking (pending, paid, refunded)

### Admin Dashboard
- Add new vehicles with complete details
- Manage vehicle availability
- View all bookings
- Confirm or cancel bookings
- Update booking and payment status

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The build files will be in the `frontend/dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email support@vehiclebooking.com or create an issue in the repository.

## Screenshots

### Home Page
- Hero section with call-to-action
- Featured vehicles display
- Key features showcase

### Vehicle Listing
- Grid layout with vehicle cards
- Advanced filtering options
- Responsive design

### Booking Page
- Date selection
- Location details
- Price calculation
- Additional requirements

### Admin Dashboard
- Vehicle management
- Booking management
- Status updates

## Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Vehicle reviews and ratings
- [ ] Advanced search with location
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Real-time availability updates
- [ ] Insurance options
- [ ] Loyalty program

## Acknowledgments

- React documentation
- Express.js documentation
- MongoDB documentation
- Tailwind CSS documentation
