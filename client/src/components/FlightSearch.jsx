import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import icons (assuming you have react-icons installed)
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaSearch } from 'react-icons/fa';

export const FlightSearch = () => {
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('roundtrip');

  return (
    <section className="section flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> 
        <div className="w-full bg-[var(--clr-card-background)]/70 backdrop-blur-md shadow-md rounded-xl mt-4 border border-[var(--clr-border)] p-6 md:p-10"> 
          <div className="text-center mb-8">
            <h1 className="section-title font-title">Find Your Perfect Flight</h1>
            <p className="section-subtitle font-text">
              Search and compare flights from hundreds of airlines
            </p>
          </div>

          {/* Trip Type Selection */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setTripType('roundtrip')}
              className={`px-6 py-3 font-title text-lg transition-colors duration-300 
                ${tripType === 'roundtrip' 
                  ? 'bg-[var(--clr-primary)] text-white rounded-l-lg' 
                  : 'bg-gray-200 text-[var(--clr-text)] hover:bg-gray-300 rounded-l-lg'}
              `}
            >
              Round Trip
            </button>
            <button
              onClick={() => setTripType('oneway')}
              className={`px-6 py-3 font-title text-lg transition-colors duration-300 
                ${tripType === 'oneway' 
                  ? 'bg-[var(--clr-primary)] text-white rounded-r-lg' 
                  : 'bg-gray-200 text-[var(--clr-text)] hover:bg-gray-300 rounded-r-lg'}
              `}
            >
              One Way
            </button>
          </div>

          {/* Search Form */}
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* From Input */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label htmlFor="departure" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                From
              </label>
              <div className="relative">
                <input 
                  id="departure"
                  type="text" 
                  placeholder="City or Airport" 
                  className="w-full rounded-lg border border-[var(--clr-border)] p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPlaneDeparture className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* To Input */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label htmlFor="destination" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                To
              </label>
              <div className="relative">
                <input 
                  id="destination"
                  type="text" 
                  placeholder="City or Airport" 
                  className="w-full rounded-lg border border-[var(--clr-border)] p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPlaneArrival className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Departure Date Picker */}
            <div className="col-span-1">
              <label htmlFor="departure-date" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                Departure
              </label>
              <div className="relative">
                <DatePicker
                  id="departure-date"
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  placeholderText="Select date"
                  className="w-full rounded-lg border border-[var(--clr-border)] p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                  minDate={new Date()}
                  dateFormat="MMM d, yyyy"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Return Date Picker */}
            <div className="col-span-1">
              <label htmlFor="return-date" className="block text-sm font-medium text-[var(--clr-text)] mb-2">
                Return
              </label>
              <div className="relative">
                <DatePicker
                  id="return-date"
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  placeholderText="Select date"
                  className="w-full rounded-lg border border-[var(--clr-border)] p-3 pl-10 text-base font-text text-[var(--clr-text)] placeholder-gray-500 focus:border-[var(--clr-primary)] focus:ring-2 focus:ring-[var(--clr-primary)]/20 transition-all duration-300 outline-none"
                  minDate={departureDate || new Date()}
                  dateFormat="MMM d, yyyy"
                  disabled={tripType === 'oneway'}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-center mt-4">
              <button 
                type="submit" 
                className="btn-primary w-full md:w-auto px-12 py-4 text-lg font-title flex items-center justify-center"
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