import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { updateSearchParams } from '../store/slices/flightSlice';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaSearch, FaUsers, FaExchangeAlt, FaStar, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import airportSearch from '../utils/airportData';

export const FlightSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    tripType: 'roundtrip',
    adults: 1,
    children: 0,
    travelClass: 'ECONOMY',
  });

  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [showPassengers, setShowPassengers] = useState(false);
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [activeField, setActiveField] = useState(null); // Track which field is active
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track keyboard selection
  const [airportSuggestions, setAirportSuggestions] = useState([]); // Local airport suggestions
  const [popularAirports, setPopularAirports] = useState([]); // Popular airports
  const [searchingAirports, setSearchingAirports] = useState(false); // Loading state

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const passengersRef = useRef(null);

  // Load popular airports on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await airportSearch.loadAirportData();
        const popular = airportSearch.getPopularAirports();
        setPopularAirports(popular);
      } catch (error) {
        console.error('Failed to load airport data:', error);
      }
    };
    
    loadInitialData();
  }, []);

  // Airport search with debounce (local search)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (activeField === 'origin') {
        await performAirportSearch(originQuery);
      }
    }, 150); // Reduced debounce for better UX with local search
    return () => clearTimeout(timer);
  }, [originQuery, activeField]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (activeField === 'destination') {
        await performAirportSearch(destinationQuery);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [destinationQuery, activeField]);

  // Perform local airport search
  const performAirportSearch = async (query) => {
    if (!query || query.length < 1) {
      setAirportSuggestions([]);
      setSearchingAirports(false);
      return;
    }

    setSearchingAirports(true);
    try {
      const results = await airportSearch.searchAirports(query, 10);
      setAirportSuggestions(results);
    } catch (error) {
      console.error('Airport search error:', error);
      setAirportSuggestions([]);
    } finally {
      setSearchingAirports(false);
    }
  };

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
      if (passengersRef.current && !passengersRef.current.contains(event.target)) {
        setShowPassengers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleOriginSearch = (value) => {
    setOriginQuery(value);
    setActiveField('origin');
    setShowOriginSuggestions(true);
    setSelectedIndex(-1); // Reset keyboard selection
  };

  const handleOriginFocus = () => {
    setActiveField('origin');
    setShowOriginSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleDestinationSearch = (value) => {
    setDestinationQuery(value);
    setActiveField('destination');
    setShowDestinationSuggestions(true);
    setSelectedIndex(-1); // Reset keyboard selection
  };

  const handleDestinationFocus = () => {
    setActiveField('destination');
    setShowDestinationSuggestions(true);
    setSelectedIndex(-1);
  };

  const selectAirport = (airport, field) => {
    if (field === 'origin') {
      setFormData(prev => ({ ...prev, origin: airport.iataCode }));
      setOriginQuery(`${airport.city} (${airport.iataCode})`);
      setShowOriginSuggestions(false);
      // Clear any previous error
      setErrors(prev => ({ ...prev, origin: '' }));
    } else {
      setFormData(prev => ({ ...prev, destination: airport.iataCode }));
      setDestinationQuery(`${airport.city} (${airport.iataCode})`);
      setShowDestinationSuggestions(false);
      // Clear any previous error
      setErrors(prev => ({ ...prev, destination: '' }));
    }
    setActiveField(null);
    setSelectedIndex(-1);
    setAirportSuggestions([]);
  };

  // Get display suggestions - either search results or popular airports
  const getDisplaySuggestions = (field) => {
    const query = field === 'origin' ? originQuery : destinationQuery;
    
    if (query.length >= 1) {
      return airportSuggestions;
    }
    
    // Show popular airports when field is focused but no search query
    if (activeField === field && query.length < 1) {
      return popularAirports;
    }
    
    return [];
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, field) => {
    const suggestions = getDisplaySuggestions(field);
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectAirport(suggestions[selectedIndex], field);
        }
        break;
      case 'Escape':
        if (field === 'origin') {
          setShowOriginSuggestions(false);
        } else {
          setShowDestinationSuggestions(false);
        }
        setSelectedIndex(-1);
        break;
    }
  };

  // Check if we're currently searching
  const isSearching = (field) => {
    const query = field === 'origin' ? originQuery : destinationQuery;
    return searchingAirports && query.length >= 1 && activeField === field;
  };

  const swapAirports = () => {
    const tempOrigin = formData.origin;
    const tempOriginQuery = originQuery;
    
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: tempOrigin
    }));
    
    setOriginQuery(destinationQuery);
    setDestinationQuery(tempOriginQuery);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.origin) newErrors.origin = 'Please select departure city';
    if (!formData.destination) newErrors.destination = 'Please select destination city';
    if (!formData.departureDate) newErrors.departureDate = 'Please select departure date';
    if (formData.tripType === 'roundtrip' && !formData.returnDate) {
      newErrors.returnDate = 'Please select return date';
    }
    if (formData.origin === formData.destination) {
      newErrors.destination = 'Destination must be different from origin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Update Redux state
    dispatch(updateSearchParams(formData));

    // Navigate to search results with parameters
    const params = new URLSearchParams({
      origin: formData.origin,
      destination: formData.destination,
      departureDate: formData.departureDate.toISOString().split('T')[0],
      ...(formData.tripType === 'roundtrip' && formData.returnDate && {
        returnDate: formData.returnDate.toISOString().split('T')[0]
      }),
      adults: formData.adults,
      children: formData.children,
      travelClass: formData.travelClass,
      tripType: formData.tripType,
    });

    navigate(`/search-results?${params.toString()}`);
  };

  const getTotalPassengers = () => {
    return formData.adults + formData.children;
  };

  return (
    <section className="section flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="w-full bg-[var(--clr-card-background)]/95 backdrop-blur-md shadow-lg rounded-xl mt-4 border border-[var(--clr-border)] p-6 md:p-10"> 
          <div className="text-center mb-8">
            <h1 className="section-title font-title">Find Your Perfect Flight</h1>
            <p className="section-subtitle font-text">
              Search and compare flights from hundreds of airlines
            </p>
          </div>

          {/* Trip Type Selection */}
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => handleInputChange('tripType', 'roundtrip')}
              className={`px-6 py-3 font-title text-lg transition-all duration-300 
                ${formData.tripType === 'roundtrip' 
                  ? 'bg-[var(--clr-primary)] text-white rounded-l-lg shadow-md' 
                  : 'bg-gray-200 text-[var(--clr-text)] hover:bg-gray-300 rounded-l-lg'}
              `}
            >
              Round Trip
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('tripType', 'oneway')}
              className={`px-6 py-3 font-title text-lg transition-all duration-300 
                ${formData.tripType === 'oneway' 
                  ? 'bg-[var(--clr-primary)] text-white rounded-r-lg shadow-md' 
                  : 'bg-gray-200 text-[var(--clr-text)] hover:bg-gray-300 rounded-r-lg'}
              `}
            >
              One Way
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Origin and Destination Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
              {/* From Input */}
              <div className="relative" ref={originRef}>
                <label htmlFor="origin" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                  From
                </label>
                <div className="relative">
                  <input 
                    id="origin"
                    type="text" 
                    value={originQuery}
                    onChange={(e) => handleOriginSearch(e.target.value)}
                    onFocus={handleOriginFocus}
                    onKeyDown={(e) => handleKeyDown(e, 'origin')}
                    placeholder="Type city name (e.g., New York, London)" 
                    autoComplete="off"
                    className={`w-full rounded-lg border p-3 pl-10 pr-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none ${
                      errors.origin ? 'border-red-500 focus:border-red-500' : 'border-[var(--clr-border)] focus:border-[var(--clr-primary)]'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPlaneDeparture className="h-5 w-5 text-gray-400" />
                  </div>
                  {isSearching('origin') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaSpinner className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>
                {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
                
                {/* Origin Suggestions */}
                {showOriginSuggestions && getDisplaySuggestions('origin').length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto scrollbar-custom backdrop-blur-sm">
                    {originQuery.length < 1 && activeField === 'origin' && (
                      <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100 flex items-center bg-gray-50">
                        <FaStar className="w-3 h-3 mr-2 text-yellow-500" />
                        Popular destinations
                      </div>
                    )}
                    {originQuery.length >= 1 && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center bg-blue-50">
                        <FaMapMarkerAlt className="w-3 h-3 mr-2 text-blue-500" />
                        Search results for "{originQuery}"
                      </div>
                    )}
                    {getDisplaySuggestions('origin').map((airport, index) => (
                      <button
                        key={airport.id}
                        type="button"
                        onClick={() => selectAirport(airport, 'origin')}
                        className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                          selectedIndex === index 
                            ? 'bg-blue-100 border-blue-200' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 truncate">
                              {airport.city}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {airport.name}
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {airport.iataCode}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {airport.country}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="hidden md:flex absolute left-1/2 top-8 transform -translate-x-1/2 z-10">
                <button
                  type="button"
                  onClick={swapAirports}
                  className="bg-white border-2 border-[var(--clr-primary)] rounded-full p-2 text-[var(--clr-primary)] hover:bg-[var(--clr-primary)] hover:text-white transition-all duration-300"
                >
                  <FaExchangeAlt className="h-4 w-4" />
                </button>
              </div>

              {/* To Input */}
              <div className="relative" ref={destinationRef}>
                <label htmlFor="destination" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                  To
                </label>
                <div className="relative">
                  <input 
                    id="destination"
                    type="text" 
                    value={destinationQuery}
                    onChange={(e) => handleDestinationSearch(e.target.value)}
                    onFocus={handleDestinationFocus}
                    onKeyDown={(e) => handleKeyDown(e, 'destination')}
                    placeholder="Type city name (e.g., Paris, Tokyo)" 
                    autoComplete="off"
                    className={`w-full rounded-lg border p-3 pl-10 pr-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none ${
                      errors.destination ? 'border-red-500 focus:border-red-500' : 'border-[var(--clr-border)] focus:border-[var(--clr-primary)]'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPlaneArrival className="h-5 w-5 text-gray-400" />
                  </div>
                  {isSearching('destination') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaSpinner className="h-4 w-4 text-blue-500 animate-spin" />
                    </div>
                  )}
                </div>
                {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
                
                {/* Destination Suggestions */}
                {showDestinationSuggestions && getDisplaySuggestions('destination').length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto scrollbar-custom backdrop-blur-sm">
                    {destinationQuery.length < 1 && activeField === 'destination' && (
                      <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100 flex items-center bg-gray-50">
                        <FaStar className="w-3 h-3 mr-2 text-yellow-500" />
                        Popular destinations
                      </div>
                    )}
                    {destinationQuery.length >= 1 && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex items-center bg-blue-50">
                        <FaMapMarkerAlt className="w-3 h-3 mr-2 text-blue-500" />
                        Search results for "{destinationQuery}"
                      </div>
                    )}
                    {getDisplaySuggestions('destination').map((airport, index) => (
                      <button
                        key={airport.id}
                        type="button"
                        onClick={() => selectAirport(airport, 'destination')}
                        className={`w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                          selectedIndex === index 
                            ? 'bg-blue-100 border-blue-200' 
                            : 'hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-800 truncate">
                              {airport.city}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {airport.name}
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {airport.iataCode}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {airport.country}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dates and Passengers Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Departure Date */}
              <div>
                <label htmlFor="departure-date" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                  Departure
                </label>
                <div className="relative">
                  <DatePicker
                    id="departure-date"
                    selected={formData.departureDate}
                    onChange={(date) => handleInputChange('departureDate', date)}
                    placeholderText="Select date"
                    className={`w-full rounded-lg border p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none ${
                      errors.departureDate ? 'border-red-500 focus:border-red-500' : 'border-[var(--clr-border)] focus:border-[var(--clr-primary)]'
                    }`}
                    minDate={new Date()}
                    dateFormat="MMM d, yyyy"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
              </div>

              {/* Return Date */}
              <div>
                <label htmlFor="return-date" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                  Return
                </label>
                <div className="relative">
                  <DatePicker
                    id="return-date"
                    selected={formData.returnDate}
                    onChange={(date) => handleInputChange('returnDate', date)}
                    placeholderText="Select date"
                    className={`w-full rounded-lg border p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none ${
                      errors.returnDate ? 'border-red-500 focus:border-red-500' : 'border-[var(--clr-border)] focus:border-[var(--clr-primary)]'
                    } ${formData.tripType === 'oneway' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    minDate={formData.departureDate || new Date()}
                    dateFormat="MMM d, yyyy"
                    disabled={formData.tripType === 'oneway'}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.returnDate && <p className="text-red-500 text-sm mt-1">{errors.returnDate}</p>}
              </div>

              {/* Passengers */}
              <div className="relative" ref={passengersRef}>
                <label className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                  Passengers
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassengers(!showPassengers)}
                  className="w-full rounded-lg border border-[var(--clr-border)] p-3 pl-10 text-base font-text text-[var(--clr-text)] text-left focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                >
                  {getTotalPassengers()} Passenger{getTotalPassengers() > 1 ? 's' : ''}
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className="h-5 w-5 text-gray-400" />
                  </div>
                </button>

                {/* Passengers Dropdown */}
                {showPassengers && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Adults</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange('adults', Math.max(1, formData.adults - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{formData.adults}</span>
                          <button
                            type="button"
                            onClick={() => handleInputChange('adults', Math.min(9, formData.adults + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Children</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange('children', Math.max(0, formData.children - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{formData.children}</span>
                          <button
                            type="button"
                            onClick={() => handleInputChange('children', Math.min(9, formData.children + 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Travel Class */}
            <div>
              <label className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                Travel Class
              </label>
              <select 
                value={formData.travelClass}
                onChange={(e) => handleInputChange('travelClass', e.target.value)}
                className="w-full rounded-lg border border-[var(--clr-border)] p-3 text-base font-text text-[var(--clr-text)] focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM_ECONOMY">Premium Economy</option>
                <option value="BUSINESS">Business</option>
                <option value="FIRST">First Class</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex justify-center pt-4">
              <button 
                type="submit" 
                className="btn-primary w-full md:w-auto px-12 py-4 text-lg font-title flex items-center justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Search Flights
                <FaSearch className="w-5 h-5 ml-3" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};