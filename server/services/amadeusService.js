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

  async searchLocations(keyword, searchType = 'all') {
    try {
      // Determine subType based on searchType parameter
      let subType;
      switch (searchType) {
        case 'airports':
          subType = 'AIRPORT';
          break;
        case 'cities':
          subType = 'CITY';
          break;
        default:
          subType = 'AIRPORT,CITY';
      }

      const params = {
        keyword: keyword.trim(),
        subType,
        view: 'FULL', // Get more detailed information
        page: {
          limit: 20 // Limit results for better performance
        }
      };

      console.log('Amadeus location search params:', params);
      const response = await this.amadeus.referenceData.locations.get(params);
      
      // If Amadeus returns results, use them
      if (response.data && response.data.length > 0) {
        return this.processAmadeusResults(response.data, keyword);
      }

      // If no results from Amadeus, check fallback database
      console.log(`No Amadeus results for "${keyword}", checking fallback database`);
      return this.searchFallbackDatabase(keyword);

    } catch (error) {
      console.error('Amadeus location search error:', {
        message: error.message,
        description: error.description,
        code: error.code,
        response: error.response?.data
      });
      
      // If Amadeus API fails, try fallback database
      console.log(`Amadeus API error for "${keyword}", trying fallback database`);
      return this.searchFallbackDatabase(keyword);
    }
  }

  // Process Amadeus API results
  processAmadeusResults(data, keyword) {
    // Process and format the location data
    const locations = data.map(location => {
      const baseLocation = {
        id: location.id,
        name: location.name,
        iataCode: location.iataCode,
        type: location.subType,
        city: location.address?.cityName || location.name,
        country: location.address?.countryName || 'Unknown',
        countryCode: location.address?.countryCode || '',
        region: location.address?.stateCode || '',
        timeZone: location.timeZoneOffset || '',
        geoCode: location.geoCode || {}
      };

      // For airports, add additional details
      if (location.subType === 'AIRPORT') {
        return {
          ...baseLocation,
          airportName: location.name,
          cityName: location.address?.cityName || 'Unknown'
        };
      }

      // For cities, we might want to find the main airport
      return baseLocation;
    });

    // Sort results: exact matches first, then by relevance
    const sortedLocations = this.sortLocationResults(locations, keyword);
    
    console.log(`Found ${sortedLocations.length} Amadeus locations for "${keyword}"`);
    return sortedLocations;
  }

  // Search fallback database for airports not in Amadeus
  searchFallbackDatabase(keyword) {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const fallbackDb = this.getFallbackAirportDatabase();
    
    // Direct city match
    if (fallbackDb[normalizedKeyword]) {
      console.log(`Found fallback airports for "${keyword}"`);
      return fallbackDb[normalizedKeyword];
    }

    // Partial matching - search through all cities
    const matches = [];
    for (const [city, airports] of Object.entries(fallbackDb)) {
      if (city.includes(normalizedKeyword) || normalizedKeyword.includes(city)) {
        matches.push(...airports);
      }
      // Also search airport names and codes
      for (const airport of airports) {
        if (airport.name.toLowerCase().includes(normalizedKeyword) ||
            airport.iataCode.toLowerCase().includes(normalizedKeyword)) {
          if (!matches.find(m => m.iataCode === airport.iataCode)) {
            matches.push(airport);
          }
        }
      }
    }

    console.log(`Found ${matches.length} fallback matches for "${keyword}"`);
    return matches;
  }

  // Helper method to sort location results by relevance
  sortLocationResults(locations, keyword) {
    const lowerKeyword = keyword.toLowerCase();
    
    return locations.sort((a, b) => {
      // Exact IATA code matches first
      if (a.iataCode && a.iataCode.toLowerCase() === lowerKeyword) return -1;
      if (b.iataCode && b.iataCode.toLowerCase() === lowerKeyword) return 1;
      
      // Exact city name matches next
      if (a.city && a.city.toLowerCase() === lowerKeyword) return -1;
      if (b.city && b.city.toLowerCase() === lowerKeyword) return 1;
      
      // City name starts with keyword
      if (a.city && a.city.toLowerCase().startsWith(lowerKeyword)) return -1;
      if (b.city && b.city.toLowerCase().startsWith(lowerKeyword)) return 1;
      
      // Airport name starts with keyword
      if (a.name && a.name.toLowerCase().startsWith(lowerKeyword)) return -1;
      if (b.name && b.name.toLowerCase().startsWith(lowerKeyword)) return 1;
      
      // Airports before cities
      if (a.type === 'AIRPORT' && b.type === 'CITY') return -1;
      if (a.type === 'CITY' && b.type === 'AIRPORT') return 1;
      
      // Alphabetical by city name
      return (a.city || '').localeCompare(b.city || '');
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

  // Get popular airports for frontend preloading
  async getPopularAirports() {
    try {
      // Major international airports that users commonly search for
      const popularCities = [
        'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Los Angeles',
        'Frankfurt', 'Amsterdam', 'Singapore', 'Sydney', 'Madrid', 'Rome',
        'Bangkok', 'Mumbai', 'Beijing', 'Seoul', 'Toronto', 'Chicago',
        'Miami', 'San Francisco', 'Istanbul', 'Hong Kong', 'Barcelona', 'Berlin'
      ];

      const allAirports = [];
      
      // Search for airports in each major city
      for (const city of popularCities.slice(0, 12)) { // Limit to prevent API overload
        try {
          const airports = await this.searchLocations(city, 'airports');
          if (airports.length > 0) {
            // Take the first (usually main) airport for each city
            allAirports.push(airports[0]);
          }
        } catch (error) {
          console.warn(`Failed to fetch airports for ${city}:`, error.message);
        }
      }

      return allAirports;
    } catch (error) {
      console.error('Error fetching popular airports:', error);
      // Return fallback popular airports if API fails
      return this.getFallbackPopularAirports();
    }
  }

  // Comprehensive fallback airport database for cities not in Amadeus test data
  getFallbackAirportDatabase() {
    return {
      // European airports often missing from Amadeus test data
      'zagreb': [
        { id: 'ZAG', name: 'Franjo Tuđman Airport Zagreb', iataCode: 'ZAG', city: 'Zagreb', country: 'Croatia', type: 'AIRPORT' }
      ],
      'vienna': [
        { id: 'VIE', name: 'Vienna International Airport', iataCode: 'VIE', city: 'Vienna', country: 'Austria', type: 'AIRPORT' }
      ],
      'prague': [
        { id: 'PRG', name: 'Václav Havel Airport Prague', iataCode: 'PRG', city: 'Prague', country: 'Czech Republic', type: 'AIRPORT' }
      ],
      'budapest': [
        { id: 'BUD', name: 'Budapest Ferenc Liszt International Airport', iataCode: 'BUD', city: 'Budapest', country: 'Hungary', type: 'AIRPORT' }
      ],
      'warsaw': [
        { id: 'WAW', name: 'Warsaw Chopin Airport', iataCode: 'WAW', city: 'Warsaw', country: 'Poland', type: 'AIRPORT' }
      ],
      'bucharest': [
        { id: 'OTP', name: 'Henri Coandă International Airport', iataCode: 'OTP', city: 'Bucharest', country: 'Romania', type: 'AIRPORT' }
      ],
      'sofia': [
        { id: 'SOF', name: 'Sofia Airport', iataCode: 'SOF', city: 'Sofia', country: 'Bulgaria', type: 'AIRPORT' }
      ],
      'athens': [
        { id: 'ATH', name: 'Athens International Airport', iataCode: 'ATH', city: 'Athens', country: 'Greece', type: 'AIRPORT' }
      ],
      'helsinki': [
        { id: 'HEL', name: 'Helsinki-Vantaa Airport', iataCode: 'HEL', city: 'Helsinki', country: 'Finland', type: 'AIRPORT' }
      ],
      'stockholm': [
        { id: 'ARN', name: 'Stockholm Arlanda Airport', iataCode: 'ARN', city: 'Stockholm', country: 'Sweden', type: 'AIRPORT' }
      ],
      'oslo': [
        { id: 'OSL', name: 'Oslo Airport', iataCode: 'OSL', city: 'Oslo', country: 'Norway', type: 'AIRPORT' }
      ],
      'copenhagen': [
        { id: 'CPH', name: 'Copenhagen Airport', iataCode: 'CPH', city: 'Copenhagen', country: 'Denmark', type: 'AIRPORT' }
      ],
      'tokyo': [
        { id: 'NRT', name: 'Narita International Airport', iataCode: 'NRT', city: 'Tokyo', country: 'Japan', type: 'AIRPORT' },
        { id: 'HND', name: 'Tokyo Haneda Airport', iataCode: 'HND', city: 'Tokyo', country: 'Japan', type: 'AIRPORT' }
      ],
      'seoul': [
        { id: 'ICN', name: 'Incheon International Airport', iataCode: 'ICN', city: 'Seoul', country: 'South Korea', type: 'AIRPORT' },
        { id: 'GMP', name: 'Gimpo International Airport', iataCode: 'GMP', city: 'Seoul', country: 'South Korea', type: 'AIRPORT' }
      ],
      'beijing': [
        { id: 'PEK', name: 'Beijing Capital International Airport', iataCode: 'PEK', city: 'Beijing', country: 'China', type: 'AIRPORT' },
        { id: 'PKX', name: 'Beijing Daxing International Airport', iataCode: 'PKX', city: 'Beijing', country: 'China', type: 'AIRPORT' }
      ],
      'shanghai': [
        { id: 'PVG', name: 'Shanghai Pudong International Airport', iataCode: 'PVG', city: 'Shanghai', country: 'China', type: 'AIRPORT' },
        { id: 'SHA', name: 'Shanghai Hongqiao International Airport', iataCode: 'SHA', city: 'Shanghai', country: 'China', type: 'AIRPORT' }
      ],
      'mumbai': [
        { id: 'BOM', name: 'Chhatrapati Shivaji International Airport', iataCode: 'BOM', city: 'Mumbai', country: 'India', type: 'AIRPORT' }
      ],
      'delhi': [
        { id: 'DEL', name: 'Indira Gandhi International Airport', iataCode: 'DEL', city: 'Delhi', country: 'India', type: 'AIRPORT' }
      ],
      'bangkok': [
        { id: 'BKK', name: 'Suvarnabhumi Airport', iataCode: 'BKK', city: 'Bangkok', country: 'Thailand', type: 'AIRPORT' },
        { id: 'DMK', name: 'Don Mueang International Airport', iataCode: 'DMK', city: 'Bangkok', country: 'Thailand', type: 'AIRPORT' }
      ],
      'kuala lumpur': [
        { id: 'KUL', name: 'Kuala Lumpur International Airport', iataCode: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', type: 'AIRPORT' }
      ],
      'jakarta': [
        { id: 'CGK', name: 'Soekarno-Hatta International Airport', iataCode: 'CGK', city: 'Jakarta', country: 'Indonesia', type: 'AIRPORT' }
      ],
      'manila': [
        { id: 'MNL', name: 'Ninoy Aquino International Airport', iataCode: 'MNL', city: 'Manila', country: 'Philippines', type: 'AIRPORT' }
      ]
    };
  }

  // Fallback popular airports if Amadeus API is unavailable
  getFallbackPopularAirports() {
    return [
      { id: 'JFK', name: 'John F Kennedy International Airport', iataCode: 'JFK', city: 'New York', country: 'United States', type: 'AIRPORT' },
      { id: 'LHR', name: 'London Heathrow Airport', iataCode: 'LHR', city: 'London', country: 'United Kingdom', type: 'AIRPORT' },
      { id: 'CDG', name: 'Charles de Gaulle Airport', iataCode: 'CDG', city: 'Paris', country: 'France', type: 'AIRPORT' },
      { id: 'NRT', name: 'Narita International Airport', iataCode: 'NRT', city: 'Tokyo', country: 'Japan', type: 'AIRPORT' },
      { id: 'DXB', name: 'Dubai International Airport', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', type: 'AIRPORT' },
      { id: 'LAX', name: 'Los Angeles International Airport', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', type: 'AIRPORT' },
      { id: 'FRA', name: 'Frankfurt Airport', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany', type: 'AIRPORT' },
      { id: 'AMS', name: 'Amsterdam Airport Schiphol', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', type: 'AIRPORT' },
      { id: 'SIN', name: 'Singapore Changi Airport', iataCode: 'SIN', city: 'Singapore', country: 'Singapore', type: 'AIRPORT' },
      { id: 'SYD', name: 'Sydney Kingsford Smith Airport', iataCode: 'SYD', city: 'Sydney', country: 'Australia', type: 'AIRPORT' }
    ];
  }

  // Helper method to format dates for Amadeus API
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

}



module.exports = new AmadeusService();