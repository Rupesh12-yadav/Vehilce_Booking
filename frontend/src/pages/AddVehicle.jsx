import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Card from '../components/ui/Card';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    type: 'car',
    fuelType: 'petrol',
    transmission: 'manual',
    seats: '',
    pricePerDay: '',
    image: '',
    description: '',
    features: '',
    location: '',
    registrationNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const vehicleData = {
        ...formData,
        year: Number(formData.year),
        seats: Number(formData.seats),
        pricePerDay: Number(formData.pricePerDay),
        features: formData.features.split(',').map((f) => f.trim()),
      };

      await api.post('/vehicles', vehicleData);
      navigate('/admin/manage-vehicles');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add vehicle');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Add New Vehicle
            </h1>
            <p className="text-gray-600">
              Fill in the details to add a new vehicle to your inventory
            </p>
          </div>

          <Card className="p-6 lg:p-8">
            {error && (
              <Alert variant="error" className="mb-6" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Basic Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Input
                          label="Vehicle Name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Honda City Premium"
                        />
                      </div>

                      <Input
                        label="Brand"
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Honda"
                      />

                      <Input
                        label="Model"
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        placeholder="e.g., City"
                      />

                      <Input
                        label="Year"
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 2023"
                        min="1900"
                        max={new Date().getFullYear() + 1}
                      />

                      <Input
                        label="Registration Number"
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g., MH01AB1234"
                      />

                      <div className="sm:col-span-2">
                        <Input
                          label="Location"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Mumbai, Maharashtra"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Specifications
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Vehicle Type <span className="text-error-500">*</span>
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="car">Car</option>
                          <option value="bike">Bike</option>
                          <option value="suv">SUV</option>
                          <option value="van">Van</option>
                          <option value="truck">Truck</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Fuel Type <span className="text-error-500">*</span>
                        </label>
                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="petrol">Petrol</option>
                          <option value="diesel">Diesel</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Transmission <span className="text-error-500">*</span>
                        </label>
                        <select
                          name="transmission"
                          value={formData.transmission}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="manual">Manual</option>
                          <option value="automatic">Automatic</option>
                        </select>
                      </div>

                      <Input
                        label="Number of Seats"
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 5"
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pricing & Media */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Pricing & Media
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        label="Price Per Day (₹)"
                        type="number"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 2500"
                        min="0"
                      />

                      <Input
                        label="Image URL"
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com/vehicle-image.jpg"
                        helperText="Provide a direct link to the vehicle image"
                      />
                    </div>
                  </div>

                  {/* Description & Features */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                      Description & Features
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description <span className="text-error-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows="6"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="Describe the vehicle, its condition, and any special features..."
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Features
                        </label>
                        <textarea
                          name="features"
                          value={formData.features}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                          placeholder="AC, GPS, Bluetooth, Sunroof, etc."
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500">Separate features with commas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Vehicle...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Vehicle
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
