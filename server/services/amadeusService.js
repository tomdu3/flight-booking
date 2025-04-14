const Amadeus = require('amadeus');

class AmadeusService {
    constructor() {
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_API_KEY,
            clientSecret: process.env.AMADEUS_API_SECRET
        });
    }

    async createBooking(flightOffer, passengers) {
        try {
            // Format passengers according to Amadeus API requirements
            const formattedTravelers = passengers.map((passenger, index) => ({
                id: (index + 1).toString(),
                dateOfBirth: passenger.dateOfBirth,
                name: {
                    firstName: passenger.firstName,
                    lastName: passenger.lastName
                },
                contact: {
                    emailAddress: passenger.email,
                    phones: [{
                        deviceType: 'MOBILE',
                        number: passenger.phone
                    }]
                },
                documents: passenger.passport ? [{
                    documentType: 'PASSPORT',
                    number: passenger.passport.number,
                    expiryDate: passenger.passport.expiryDate,
                    issuanceCountry: passenger.passport.issuanceCountry,
                    nationality: passenger.passport.issuanceCountry
                }] : []
            }));

            const response = await this.amadeus.booking.flightOrders.post(
                JSON.stringify({
                    data: {
                        type: 'flight-order',
                        flightOffers: [flightOffer],
                        travelers: formattedTravelers
                    }
                })
            );

            return response.data;
        } catch (error) {
            console.error('Amadeus booking error:', error);
            throw new Error('Failed to create booking with Amadeus');
        }
    }

    async cancelBooking(bookingId) {
        try {
            await this.amadeus.booking.flightOrder(bookingId).delete();
        } catch (error) {
            console.error('Amadeus cancellation error:', error);
            throw new Error('Failed to cancel booking with Amadeus');
        }
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

  async findAirportCodes(cityName, countryCode = null) {
    const params = {
      keyword: cityName,
      subType: 'AIRPORT,CITY',
      view: 'LIGHT'
    };
    
    if (countryCode) {
      params.countryCode = countryCode;
    }
  
    const response = await this.amadeus.referenceData.locations.get(params);
    
    // Filter to get airports only and extract IATA codes
    return response.data
      .filter(loc => loc.subType === 'AIRPORT')
      .map(airport => airport.iataCode);
  }
}



module.exports = new AmadeusService();