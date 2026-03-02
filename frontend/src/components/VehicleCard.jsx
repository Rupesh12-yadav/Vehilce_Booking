import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

const VehicleCard = ({ vehicle }) => {
  return (
    <Card hover className="overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant={vehicle.available ? 'success' : 'error'}>
            {vehicle.available ? 'Available' : 'Booked'}
          </Badge>
        </div>
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1">
          <svg className="w-4 h-4 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">{vehicle.rating || '4.5'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Brand */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
            {vehicle.name}
          </h3>
          <p className="text-sm text-gray-600">
            {vehicle.brand} {vehicle.model} • {vehicle.year}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="primary" className="text-xs">
            {vehicle.type}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {vehicle.fuelType}
          </Badge>
          <Badge variant="gray" className="text-xs">
            {vehicle.transmission}
          </Badge>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{vehicle.location || 'Mumbai'}</span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary-600">
                ₹{vehicle.pricePerDay}
              </span>
              <span className="text-sm text-gray-500">/day</span>
            </div>
          </div>
          <Link to={`/vehicles/${vehicle._id}`}>
            <Button size="sm" variant="primary">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default VehicleCard;
