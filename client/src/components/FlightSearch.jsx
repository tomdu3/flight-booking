import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const FlightSearch = () => {
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('roundtrip');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-[90%] bg-white/95 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100"> 
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Find Your Perfect Flight
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Search and compare flights from hundreds of airlines
          </p>
        </div>
        
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => setTripType('roundtrip')}
            className={`px-4 py-2 font-medium ${tripType === 'roundtrip' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('oneway')}
            className={`px-4 py-2 font-medium ${tripType === 'oneway' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            One Way
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <input 
                id="departure"
                type="text" 
                placeholder="City or Airport" 
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <input 
                id="destination"
                type="text" 
                placeholder="City or Airport" 
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <div className="relative">
              <DatePicker
                id="departure-date"
                selected={departureDate}
                onChange={(date) => setDepartureDate(date)}
                placeholderText="Select date"
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                minDate={new Date()}
                dateFormat="MMM d, yyyy"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <div className="relative">
              <DatePicker
                id="return-date"
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                placeholderText="Select date"
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                minDate={departureDate || new Date()}
                dateFormat="MMM d, yyyy"
                disabled={tripType === 'oneway'}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-center mt-2">
            <button 
              type="submit" 
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-base transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search Flights
              <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};