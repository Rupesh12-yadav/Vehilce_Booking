import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data } = await api.get(`/vehicles/${id}`);
      setVehicle(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) return <Loader />;

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/vehicles"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vehicles
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 sticky top-24">
              <div className="relative h-[400px] sm:h-[500px]">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={vehicle.available ? 'success' : 'error'} className="text-sm px-3 py-1">
                    {vehicle.available ? 'Available' : 'Booked'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header Info */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {vehicle.name}
              </h1>
              <div className="flex items-center gap-3 text-gray-600 text-lg">
                <span className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</span>
                <span>•</span>
                <span>{vehicle.year}</span>
              </div>
            </div>

            {/* Rating & Location */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-gray-900 text-lg">{vehicle.rating || '4.5'}</span>
                <span className="text-gray-500">({vehicle.reviews || 12} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600 text-lg">{vehicle.location}</span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-semibold text-gray-900 capitalize">{vehicle.type}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Fuel</p>
                <p className="font-semibold text-gray-900 capitalize">{vehicle.fuelType}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Transmission</p>
                <p className="font-semibold text-gray-900 capitalize">{vehicle.transmission}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Seats</p>
                <p className="font-semibold text-gray-900">{vehicle.seats} Persons</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {vehicle.description}
              </p>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 bg-white border border-gray-200 px-4 py-3 rounded-lg">
                      <svg className="w-5 h-5 text-success-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Action */}
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 mt-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary-600">₹{vehicle.pricePerDay}</span>
                    <span className="text-gray-500 font-medium">/day</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleBookNow}
                disabled={!vehicle.available}
                className="w-full py-4 text-lg shadow-lg shadow-primary-600/20"
                size="lg"
              >
                {vehicle.available ? 'Book Now' : 'Currently Unavailable'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
