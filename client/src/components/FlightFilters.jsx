import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFilters, updateSort } from '../store/slices/flightSlice';
import { FaFilter } from 'react-icons/fa';

export const FlightFilters = () => {
  const dispatch = useDispatch();
  const { filters, sortBy, sortOrder, flights } = useSelector(state => state.flights);
  
  const [priceRange, setPriceRange] = useState(filters.priceRange);

  // Get unique airlines from flights
  const airlines = [...new Set(flights.map(flight => flight.airline))];
  
  // Get price range from flights
  const prices = flights.map(flight => flight.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 5000);

  const handlePriceChange = (value, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    setPriceRange(newRange);
    dispatch(updateFilters({ priceRange: newRange }));
  };

  const handleStopsFilter = (stops) => {
    dispatch(updateFilters({ stops }));
  };

  const handleAirlineFilter = (airline) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    dispatch(updateFilters({ airlines: newAirlines }));
  };

  const handleDepartureTimeFilter = (departureTime) => {
    dispatch(updateFilters({ departureTime }));
  };

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(updateSort({ sortBy: newSortBy, sortOrder: newSortOrder }));
  };

  const clearAllFilters = () => {
    dispatch(updateFilters({
      priceRange: [minPrice, maxPrice],
      stops: 'all',
      airlines: [],
      departureTime: 'all',
    }));
    setPriceRange([minPrice, maxPrice]);
  };

  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Sort by</h4>
        <div className="space-y-2">
          {[
            { key: 'price', label: 'Price' },
            { key: 'duration', label: 'Duration' },
            { key: 'departure', label: 'Departure Time' },
            { key: 'arrival', label: 'Arrival Time' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleSortChange(option.key)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                sortBy === option.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
              {sortBy === option.key && (
                <span className="float-right">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e.target.value, 0)}
              className="flex-1"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e.target.value, 1)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Stops</h4>
        <div className="space-y-2">
          {[
            { key: 'all', label: 'Any number of stops' },
            { key: 'nonstop', label: 'Nonstop' },
            { key: '1stop', label: '1 stop' },
            { key: '2+stops', label: '2+ stops' },
          ].map((option) => (
            <label key={option.key} className="flex items-center">
              <input
                type="radio"
                name="stops"
                value={option.key}
                checked={filters.stops === option.key}
                onChange={() => handleStopsFilter(option.key)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Airlines */}
      {airlines.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Airlines</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {airlines.map((airline) => (
              <label key={airline} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.airlines.includes(airline)}
                  onChange={() => handleAirlineFilter(airline)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">{airline}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Departure Time */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Departure Time</h4>
        <div className="space-y-2">
          {[
            { key: 'all', label: 'Any time' },
            { key: 'morning', label: 'Morning (6AM - 12PM)' },
            { key: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
            { key: 'evening', label: 'Evening (6PM - 12AM)' },
            { key: 'night', label: 'Night (12AM - 6AM)' },
          ].map((option) => (
            <label key={option.key} className="flex items-center">
              <input
                type="radio"
                name="departureTime"
                value={option.key}
                checked={filters.departureTime === option.key}
                onChange={() => handleDepartureTimeFilter(option.key)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={clearAllFilters}
          className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};