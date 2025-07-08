const Amadeus = require('amadeus');

class AmadeusService {
    constructor() {
        // Validate required environment variables
        if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
            throw new Error('AMADEUS_API_KEY and AMADEUS_API_SECRET must be configured in .env file');
        }
        
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_API_KEY,
            clientSecret: process.env.AMADEUS_API_SECRET,
            hostname: 'test' // Use 'test' for testing, 'production' for live
        });
        
        console.log('Amadeus API initialized successfully');
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

            // For testing purposes, create a mock booking response
            // In production, uncomment the real Amadeus API call below
            const mockResponse = {
                id: `amadeus_${Date.now()}`,
                type: 'flight-order',
                associatedRecords: [{
                    reference: `AMB${Date.now()}`,
                    creationDate: new Date().toISOString()
                }]
            };

            // Uncomment below for actual Amadeus API call
            // const response = await this.amadeus.booking.flightOrders.post(
            //     JSON.stringify({
            //         data: {
            //             type: 'flight-order',
            //             flightOffers: [flightOffer],
            //             travelers: formattedTravelers
            //         }
            //     })
            // );
            // return response.data;

            return mockResponse;
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
      // Validate required parameters
      if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
        throw new Error('Missing required search parameters: origin, destination, and departureDate are required');
      }

      // Format date properly for Amadeus API (YYYY-MM-DD)
      const formattedParams = {
        ...params,
        departureDate: this.formatDate(params.departureDate),
        returnDate: params.returnDate ? this.formatDate(params.returnDate) : undefined,
        adults: parseInt(params.adults) || 1,
        currencyCode: params.currencyCode || 'USD'
      };

      // Remove undefined values
      Object.keys(formattedParams).forEach(key => {
        if (formattedParams[key] === undefined) {
          delete formattedParams[key];
        }
      });

      console.log('Amadeus API request params:', formattedParams);
      const response = await this.amadeus.shopping.flightOffersSearch.get(formattedParams);
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      console.log(`Found ${response.data.length} flight offers`);
      return this.formatFlightData(response.data);
    } catch (error) {
      console.error('Amadeus API error:', {
        message: error.message,
        description: error.description,
        code: error.code,
        response: error.response?.data
      });
      
      // Re-throw the error with more context
      if (error.response?.data?.errors) {
        const amadeusError = error.response.data.errors[0];
        throw new Error(`Amadeus API Error: ${amadeusError.title} - ${amadeusError.detail}`);
      }
      
      throw new Error(`Flight search failed: ${error.message}`);
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
        price: parseFloat(price.grandTotal),
        currency: price.currency,
        bookingClass: offer.travelerPricings?.[0]?.fareOption || 'ECONOMY',
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
    try {
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
    } catch (error) {
      console.error('Airport search error:', error);
      return [];
    }
  }

  // Helper method to format dates for Amadeus API
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

}



module.exports = new AmadeusService();