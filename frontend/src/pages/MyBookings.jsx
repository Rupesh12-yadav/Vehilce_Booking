import { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">My Bookings</h1>

        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => {
              // Handle case where vehicle might be null (deleted)
              const vehicle = booking.vehicle || {
                name: 'Vehicle Unavailable',
                brand: 'N/A',
                model: 'N/A',
                image: 'https://via.placeholder.com/400x300?text=Vehicle+Not+Found'
              };

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                    <div className="md:col-span-1">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold">
                            {vehicle.name}
                          </h2>
                          <p className="text-gray-600">
                            {vehicle.brand} {vehicle.model}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-semibold">Start Date:</span>{' '}
                            {new Date(booking.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">End Date:</span>{' '}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Total Days:</span>{' '}
                            {booking.totalDays}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-semibold">Pickup:</span>{' '}
                            {booking.pickupLocation}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Dropoff:</span>{' '}
                            {booking.dropoffLocation}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Driver:</span>{' '}
                            {booking.driverRequired ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t pt-4">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            ₹{booking.totalPrice}
                          </span>
                          <span className="text-gray-600 ml-2">
                            ({booking.paymentStatus})
                          </span>
                        </div>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl mb-4">No bookings found</p>
            <a
              href="/vehicles"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition"
            >
              Browse Vehicles
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
