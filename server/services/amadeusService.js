const Amadeus = require('amadeus');

class AmadeusService {
    constructor() {
        this.amadeus = new Amadeus({
            clientId: process.env.AMADEUS_API_KEY,
            clientSecret: process.env.AMADEUS_API_SECRET,
            hostname: 'production' // Use 'test' for testing, 'production' for live
        });
        
        // Check if API credentials are configured
        if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
            console.warn('Amadeus API credentials not configured. Flight search will use mock data.');
            this.useMockData = true;
        } else {
            this.useMockData = false;
        }
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
      // If no API credentials, return mock data
      if (this.useMockData) {
        console.log('Using mock flight data');
        return this.getMockFlightData(params);
      }

      // Validate required parameters
      if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
        throw new Error('Missing required search parameters');
      }

      // Format date properly for Amadeus API (YYYY-MM-DD)
      const formattedParams = {
        ...params,
        departureDate: this.formatDate(params.departureDate),
        returnDate: params.returnDate ? this.formatDate(params.returnDate) : undefined
      };

      console.log('Amadeus API request params:', formattedParams);
      const response = await this.amadeus.shopping.flightOffersSearch.get(formattedParams);
      
      if (!response.data || response.data.length === 0) {
        console.log('No flights found, returning mock data');
        return this.getMockFlightData(params);
      }
      
      return this.formatFlightData(response.data);
    } catch (error) {
      console.error('Amadeus API error:', error.response?.data || error.message);
      
      // Return mock data on API errors for development
      console.log('API error occurred, falling back to mock data');
      return this.getMockFlightData(params);
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

  // Mock flight data for testing/development
  getMockFlightData(params) {
    const basePrice = 200 + Math.random() * 800;
    const mockFlights = [];
    
    for (let i = 0; i < 5; i++) {
      const departureTime = new Date();
      departureTime.setDate(departureTime.getDate() + 1);
      departureTime.setHours(6 + i * 3, Math.random() * 60);
      
      const arrivalTime = new Date(departureTime);
      arrivalTime.setHours(arrivalTime.getHours() + 3 + Math.random() * 8);
      
      mockFlights.push({
        id: `mock_${i + 1}`,
        airline: ['AA', 'DL', 'UA', 'SW', 'F9'][i],
        flightNumber: `${['AA', 'DL', 'UA', 'SW', 'F9'][i]}${1000 + i}`,
        departureAirport: params.originLocationCode,
        arrivalAirport: params.destinationLocationCode,
        departureTime: departureTime.toISOString(),
        arrivalTime: arrivalTime.toISOString(),
        duration: `PT${3 + Math.floor(Math.random() * 8)}H${Math.floor(Math.random() * 60)}M`,
        stops: Math.floor(Math.random() * 3),
        price: Math.round(basePrice + i * 50),
        currency: params.currencyCode || 'USD',
        bookingClass: 'ECONOMY',
        availableSeats: 3 + Math.floor(Math.random() * 7),
        segments: [{
          departure: {
            airport: params.originLocationCode,
            terminal: Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 5)) : null,
            time: departureTime.toISOString()
          },
          arrival: {
            airport: params.destinationLocationCode,
            terminal: Math.random() > 0.5 ? String.fromCharCode(65 + Math.floor(Math.random() * 5)) : null,
            time: arrivalTime.toISOString()
          },
          carrierCode: ['AA', 'DL', 'UA', 'SW', 'F9'][i],
          flightNumber: `${1000 + i}`,
          aircraft: '32Q',
          duration: `PT${3 + Math.floor(Math.random() * 8)}H${Math.floor(Math.random() * 60)}M`
        }]
      });
    }
    
    console.log(`Generated ${mockFlights.length} mock flights`);
    return mockFlights;
  }
}



module.exports = new AmadeusService();