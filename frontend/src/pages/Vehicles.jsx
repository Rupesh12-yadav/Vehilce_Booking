import { useState, useEffect } from 'react';
import api from '../services/api';
import VehicleCard from '../components/VehicleCard';
import Loader from '../components/Loader';
import Card from '../components/ui/Card';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    fuelType: '',
    transmission: '',
    available: 'true',
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const { data } = await api.get(`/vehicles?${queryParams.toString()}`);
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const getFilteredAndSortedVehicles = () => {
    // First filter by search query
    let filteredVehicles = vehicles.filter((vehicle) => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        vehicle.name?.toLowerCase().includes(query) ||
        vehicle.brand?.toLowerCase().includes(query) ||
        vehicle.model?.toLowerCase().includes(query) ||
        vehicle.type?.toLowerCase().includes(query) ||
        vehicle.fuelType?.toLowerCase().includes(query)
      );
    });
    
    // Then sort
    switch (sortBy) {
      case 'price-low':
        return filteredVehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price-high':
        return filteredVehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return filteredVehicles.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return filteredVehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'featured':
      default:
        return filteredVehicles;
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      fuelType: '',
      transmission: '',
      available: 'true',
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Browse Vehicles
            </h1>
            <p className="text-lg text-primary-100 mb-6">
              Discover our wide selection of premium vehicles for your next journey
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, brand, model, type..."
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <Card className="p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vehicle Type
                  </label>
                  <div className="space-y-2">
                    {['', 'car', 'bike', 'suv', 'van', 'truck'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={filters.type === type}
                          onChange={handleFilterChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {type === '' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fuel Type
                  </label>
                  <div className="space-y-2">
                    {['', 'petrol', 'diesel', 'electric', 'hybrid'].map((fuel) => (
                      <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="fuelType"
                          value={fuel}
                          checked={filters.fuelType === fuel}
                          onChange={handleFilterChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {fuel === '' ? 'All Fuel Types' : fuel.charAt(0).toUpperCase() + fuel.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Transmission
                  </label>
                  <div className="space-y-2">
                    {['', 'manual', 'automatic'].map((trans) => (
                      <label key={trans} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="transmission"
                          value={trans}
                          checked={filters.transmission === trans}
                          onChange={handleFilterChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {trans === '' ? 'All Transmissions' : trans.charAt(0).toUpperCase() + trans.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Availability
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '', label: 'All' },
                      { value: 'true', label: 'Available' },
                      { value: 'false', label: 'Booked' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="available"
                          value={option.value}
                          checked={filters.available === option.value}
                          onChange={handleFilterChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Vehicles Grid */}
          <main className="lg:col-span-9">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getFilteredAndSortedVehicles().length} {getFilteredAndSortedVehicles().length === 1 ? 'Vehicle' : 'Vehicles'} Found
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Showing all available vehicles'}
                </p>
              </div>
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Vehicles Grid */}
            {getFilteredAndSortedVehicles().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getFilteredAndSortedVehicles().map((vehicle) => (
                  <VehicleCard key={vehicle._id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No vehicles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try a different search term.`
                    : 'Try adjusting your filters to see more results'}
                </p>
                <div className="flex gap-3 justify-center">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Clear Filters
                  </button>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
