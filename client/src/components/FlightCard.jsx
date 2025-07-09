import { useState } from 'react';
import { FaPlane, FaClock, FaWifi, FaUtensils, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const FlightCard = ({ flight }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDuration = (duration) => {
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const hours = parseInt(matches[1]) || 0;
    const minutes = parseInt(matches[2]) || 0;
    return `${hours}h ${minutes}m`;
  };

  const getStopsText = (stops) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Main Flight Info */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Left: Flight Info */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <span className="text-blue-600 font-bold text-sm">{flight.airline}</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">{flight.flightNumber}</div>
                <div className="text-sm text-gray-500">{flight.bookingClass}</div>
              </div>
            </div>

            {/* Time and Route */}
            <div className="flex items-center space-x-6">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {flight.departureAirport}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(flight.departureTime).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Flight Path */}
              <div className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">
                  {formatDuration(flight.duration)}
                </div>
                <div className="w-full flex items-center">
                  <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
                  <div className="flex-1 h-0.5 bg-gray-300 mx-2 relative">
                    <FaPlane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                  </div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getStopsText(flight.stops)}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {flight.arrivalAirport}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(flight.arrivalTime).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Price and Book */}
          <div className="ml-8 text-right">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${Math.round(flight.price)}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              per person
            </div>
            <button className="btn-primary w-full mb-2">
              Select Flight
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 text-sm font-medium flex items-center justify-center w-full"
            >
              Flight Details
              {showDetails ? (
                <FaChevronUp className="ml-1" />
              ) : (
                <FaChevronDown className="ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <FaWifi className="mr-1" />
            WiFi
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaUtensils className="mr-1" />
            Meal
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-1" />
            {flight.availableSeats} seats left
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Flight Details</h4>
          
          {flight.segments.map((segment, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <span className="text-blue-600 font-bold text-xs">
                      {segment.carrierCode}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">
                      {segment.carrierCode} {segment.flightNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {segment.aircraft}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="font-semibold">
                      {formatTime(segment.departure.time)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {segment.departure.airport}
                    </div>
                    {segment.departure.terminal && (
                      <div className="text-xs text-gray-500">
                        Terminal {segment.departure.terminal}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-gray-500">
                      {formatDuration(segment.duration)}
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300 my-2"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">
                      {formatTime(segment.arrival.time)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {segment.arrival.airport}
                    </div>
                    {segment.arrival.terminal && (
                      <div className="text-xs text-gray-500">
                        Terminal {segment.arrival.terminal}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {index < flight.segments.length - 1 && (
                <div className="text-center py-2">
                  <div className="text-sm text-gray-500">
                    Layover in {segment.arrival.airport}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};