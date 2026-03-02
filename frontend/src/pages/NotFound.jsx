import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 px-4">
      <div className="text-center max-w-xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-primary-600 mb-3">ERROR 404</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 text-lg mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button className="w-full sm:w-auto">Go To Home</Button>
          </Link>
          <Link to="/vehicles">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-primary-300 text-primary-700 hover:bg-primary-100"
            >
              Browse Vehicles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
