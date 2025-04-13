const Amadeus = require('amadeus');
require('dotenv').config();

class AmadeusService {
  constructor() {
    this.amadeus = new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET,
      // Use test environment for development
      hostname: process.env.NODE_ENV === 'production' ? 'production' : 'test'
    });
  }

  async flightOffersSearch(params) {
    try {
      const response = await this.amadeus.shopping.flightOffersSearch.get(params);
      return this.formatFlightData(response.data);
    } catch (error) {
      console.error('Amadeus API error:', error);
      throw new Error('Failed to fetch flight data');
    }
  }

  formatFlightData(flights) {
    return flights.map(offer => {
      const itinerary = offer.itineraries[0];
      const price = offer.price;
      const segments = itinerary.segments;
      
      return {
        id: offer.id,
        airline: segments[0].carrierCode,
        flightNumber: segments[0].number,
        departureAirport: segments[0].departure.iataCode,
        arrivalAirport: segments[segments.length - 1].arrival.iataCode,
        departureTime: segments[0].departure.at,
        arrivalTime: segments[segments.length - 1].arrival.at,
        duration: itinerary.duration,
        stops: segments.length - 1,
        price: price.grandTotal,
        currency: price.currency,
        bookingClass: offer.travelerPricings[0].fareOption,
        availableSeats: parseInt(offer.numberOfBookableSeats) || 9, // Amadeus typically shows up to 9
        segments: segments.map(segment => ({
          departure: {
            airport: segment.departure.iataCode,
            terminal: segment.departure.terminal,
            time: segment.departure.at
          },
          arrival: {
            airport: segment.arrival.iataCode,
            terminal: segment.arrival.terminal,
            time: segment.arrival.at
          },
          carrierCode: segment.carrierCode,
          flightNumber: segment.number,
          aircraft: segment.aircraft.code,
          duration: segment.duration
        }))
      };
    });
  }
}

module.exports = new AmadeusService();