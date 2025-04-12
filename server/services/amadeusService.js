const Amadeus = require('amadeus');
require('dotenv').config();

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

const searchFlights = async (params) => {
  try {
    const { from, to, date, persons } = params;
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: persons || 1,
      max: 10
    });
    return formatAmadeusResponse(response.data);
  } catch (error) {
    console.error('Amadeus API error:', error);
    throw new Error('Flight search failed');
  }
};

const formatAmadeusResponse = (data) => {
  return data.map(offer => {
    const segments = offer.itineraries[0].segments;
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    
    return {
      id: offer.id, // Use Amadeus ID for reference
      airline: firstSegment.carrierCode,
      flightNumber: firstSegment.number,
      departure: {
        airport: firstSegment.departure.iataCode,
        time: new Date(firstSegment.departure.at)
      },
      arrival: {
        airport: lastSegment.arrival.iataCode,
        time: new Date(lastSegment.arrival.at)
      },
      duration: calculateDuration(
        firstSegment.departure.at,
        lastSegment.arrival.at
      ),
      price: parseFloat(offer.price.total),
      seatsAvailable: 9, // Default value
      class: mapAmadeusClass(offer.travelerPricings[0].fareOption)
    };
  });
};

const mapAmadeusClass = (fareOption) => {
  // Map Amadeus fare options to your class system
  const classMap = {
    'STANDARD': 'standard',
    'ECONOMY': 'economy',
    'BUSINESS': 'business',
    'FIRST': 'first'
  };
  return classMap[fareOption] || 'standard';
};

const calculateDuration = (departure, arrival) => {
  const dep = new Date(departure);
  const arr = new Date(arrival);
  return Math.round((arr - dep) / (1000 * 60)); // Minutes
};

module.exports = { searchFlights };