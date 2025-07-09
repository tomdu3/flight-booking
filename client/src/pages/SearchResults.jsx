import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchFlights } from '../store/slices/flightSlice';
import { FlightCard } from '../components/FlightCard';
import { FlightFilters } from '../components/FlightFilters';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { FaPlane, FaArrowLeft, FaFilter } from 'react-icons/fa';

export const SearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { 
    filteredFlights, 
    loading, 
    error, 
    totalFlights,
    searchParams: searchState 
  } = useSelector(state => state.flights);

  useEffect(() => {
    // Extract search parameters from URL
    const params = {
      origin: searchParams.get('origin'),
      destination: searchParams.get('destination'),
      departureDate: searchParams.get('departureDate'),
      returnDate: searchParams.get('returnDate'),
      adults: parseInt(searchParams.get('adults')) || 1,
      children: parseInt(searchParams.get('children')) || 0,
      travelClass: searchParams.get('travelClass') || 'ECONOMY',
      tripType: searchParams.get('tripType') || 'roundtrip',
    };

    // Only search if we have required parameters
    if (params.origin && params.destination && params.departureDate) {
      dispatch(searchFlights(params));
    }
  }, [searchParams, dispatch]);

  const formatSearchSummary = () => {
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults') || 1;
    const tripType = searchParams.get('tripType');

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lg font-semibold text-gray-800">
              <span className="text-blue-600 font-bold">{origin}</span>
              <FaPlane className="mx-3 text-gray-400 transform rotate-45" />
              <span className="text-blue-600 font-bold">{destination}</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(departureDate).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
              {returnDate && tripType === 'roundtrip' && (
                <>
                  {' - '}
                  {new Date(returnDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {adults} Adult{adults > 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-outline-primary flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            New Search
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {formatSearchSummary()}
          <LoadingSpinner message="Searching for flights..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {formatSearchSummary()}
          <ErrorMessage 
            message={error} 
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {formatSearchSummary()}
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="flex items-center mb-4">
                <FaFilter className="mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>
              <FlightFilters />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {filteredFlights.length} of {totalFlights} flights found
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                    <option value="price">Price (Low to High)</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                    <option value="arrival">Arrival Time</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredFlights.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaPlane className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No flights found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters to find more options.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  New Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};