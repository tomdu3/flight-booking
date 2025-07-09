// Airport search utility with CSV data
class AirportSearch {
  constructor() {
    this.airports = [];
    this.loaded = false;
    this.loadPromise = null;
  }

  // Load airport data from CSV
  async loadAirportData() {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = (async () => {
      try {
        const response = await fetch('/data/airports.csv');
        const csvText = await response.text();
        
        // Parse CSV data
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        this.airports = lines.slice(1).map(line => {
          const values = this.parseCSVLine(line);
          return {
            id: values[0], // iata_code
            iataCode: values[0],
            name: values[1], // airport_name
            city: values[2],
            country: values[3],
            countryCode: values[4],
            latitude: parseFloat(values[5]) || 0,
            longitude: parseFloat(values[6]) || 0,
            type: 'AIRPORT'
          };
        });

        this.loaded = true;
        console.log(`Loaded ${this.airports.length} airports from CSV`);
        return this.airports;
      } catch (error) {
        console.error('Failed to load airport data:', error);
        this.airports = this.getFallbackAirports();
        this.loaded = true;
        return this.airports;
      }
    })();

    return this.loadPromise;
  }

  // Parse CSV line handling quoted fields
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  // Search airports with multiple strategies
  async searchAirports(query, limit = 10) {
    if (!this.loaded) {
      await this.loadAirportData();
    }

    if (!query || query.length < 1) {
      return this.getPopularAirports().slice(0, limit);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    const seen = new Set();

    // 1. Exact IATA code match
    for (const airport of this.airports) {
      if (airport.iataCode.toLowerCase() === normalizedQuery) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 100 });
          seen.add(airport.iataCode);
        }
      }
    }

    // 2. City name exact match
    for (const airport of this.airports) {
      if (airport.city.toLowerCase() === normalizedQuery) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 90 });
          seen.add(airport.iataCode);
        }
      }
    }

    // 3. City name starts with query
    for (const airport of this.airports) {
      if (airport.city.toLowerCase().startsWith(normalizedQuery)) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 80 });
          seen.add(airport.iataCode);
        }
      }
    }

    // 4. City name contains query
    for (const airport of this.airports) {
      if (airport.city.toLowerCase().includes(normalizedQuery)) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 70 });
          seen.add(airport.iataCode);
        }
      }
    }

    // 5. Airport name contains query
    for (const airport of this.airports) {
      if (airport.name.toLowerCase().includes(normalizedQuery)) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 60 });
          seen.add(airport.iataCode);
        }
      }
    }

    // 6. Country name contains query
    for (const airport of this.airports) {
      if (airport.country.toLowerCase().includes(normalizedQuery)) {
        if (!seen.has(airport.iataCode)) {
          results.push({ ...airport, score: 50 });
          seen.add(airport.iataCode);
        }
      }
    }

    // Sort by score (highest first) and return limited results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...airport }) => airport);
  }

  // Get popular airports for initial display
  getPopularAirports() {
    const popularCities = [
      'New York', 'London', 'Paris', 'Tokyo', 'Dubai', 'Los Angeles',
      'Frankfurt', 'Amsterdam', 'Singapore', 'Sydney', 'Madrid', 'Rome',
      'Bangkok', 'Mumbai', 'Beijing', 'Seoul', 'Toronto', 'Chicago',
      'Miami', 'San Francisco', 'Barcelona', 'Berlin', 'Vienna', 'Zagreb'
    ];

    const popular = [];
    for (const city of popularCities) {
      const airport = this.airports.find(a => 
        a.city.toLowerCase() === city.toLowerCase()
      );
      if (airport && !popular.find(p => p.iataCode === airport.iataCode)) {
        popular.push(airport);
      }
    }

    return popular.slice(0, 15);
  }

  // Fallback airports if CSV fails to load
  getFallbackAirports() {
    return [
      { id: 'JFK', iataCode: 'JFK', name: 'John F Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'US', type: 'AIRPORT' },
      { id: 'LHR', iataCode: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GB', type: 'AIRPORT' },
      { id: 'CDG', iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FR', type: 'AIRPORT' },
      { id: 'NRT', iataCode: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', type: 'AIRPORT' },
      { id: 'DXB', iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
      { id: 'LAX', iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', countryCode: 'US', type: 'AIRPORT' },
      { id: 'FRA', iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', type: 'AIRPORT' },
      { id: 'AMS', iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', type: 'AIRPORT' },
      { id: 'SIN', iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG', type: 'AIRPORT' },
      { id: 'SYD', iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', countryCode: 'AU', type: 'AIRPORT' },
      { id: 'ZAG', iataCode: 'ZAG', name: 'Franjo Tuđman Airport Zagreb', city: 'Zagreb', country: 'Croatia', countryCode: 'HR', type: 'AIRPORT' },
      { id: 'VIE', iataCode: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', countryCode: 'AT', type: 'AIRPORT' }
    ];
  }

  // Get airport by IATA code
  async getAirportByCode(iataCode) {
    if (!this.loaded) {
      await this.loadAirportData();
    }
    
    return this.airports.find(airport => 
      airport.iataCode.toUpperCase() === iataCode.toUpperCase()
    );
  }

  // Get all airports for a city
  async getAirportsByCity(cityName) {
    if (!this.loaded) {
      await this.loadAirportData();
    }
    
    return this.airports.filter(airport => 
      airport.city.toLowerCase() === cityName.toLowerCase()
    );
  }
}

// Create a singleton instance
const airportSearch = new AirportSearch();

export default airportSearch;