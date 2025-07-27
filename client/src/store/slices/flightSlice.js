import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = '/api';

// Async thunk for flight search
export const searchFlights = createAsyncThunk(
  'flights/searchFlights',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/flights/search`, {
        params: searchParams,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search flights'
      );
    }
  }
);

// Async thunk for airport search with enhanced city name support
const searchAirports = createAsyncThunk(
  'flights/searchAirports',
  async (keyword, { rejectWithValue, getState }) => {
    try {
      // Check if we have cached results for this keyword
      const state = getState();
      const cacheKey = keyword.toLowerCase();
      if (state.flights.airportCache[cacheKey] && 
          Date.now() - state.flights.airportCache[cacheKey].timestamp < 300000) { // 5 min cache
        return { airports: state.flights.airportCache[cacheKey].data };
      }

      console.log('Searching airports for:', keyword);
      const response = await axios.get(`${API_BASE_URL}/flights/airports`, {
        params: { keyword, searchType: 'all' },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Airport search response:', response.data);
      
      // Filter to prioritize airports over cities and format data
      const airports = (response.data.airports || [])
        .map(airport => ({
          id: airport.id,
          name: airport.name || airport.airportName || airport.cityName,
          iataCode: airport.iataCode,
          city: airport.city || airport.cityName,
          country: airport.country,
          type: airport.type,
          geoCode: airport.geoCode
        }))
        .filter(airport => airport.iataCode) // Only include items with IATA codes
        .sort((a, b) => {
          // Prioritize airports over cities
          if (a.type === 'AIRPORT' && b.type === 'CITY') return -1;
          if (a.type === 'CITY' && b.type === 'AIRPORT') return 1;
          return 0;
        });
      
      // Return with cache info
      return {
        airports,
        cacheKey,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Airport search error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search airports'
      );
    }
  }
);

// Async thunk to load popular airports
const loadPopularAirports = createAsyncThunk(
  'flights/loadPopularAirports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/flights/airports/popular`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.airports || [];
    } catch (error) {
      console.error('Popular airports error:', error);
      // Return fallback airports if API fails
      return [
        { id: 'JFK', name: 'John F Kennedy International Airport', iataCode: 'JFK', city: 'New York', country: 'United States', type: 'AIRPORT' },
        { id: 'LHR', name: 'London Heathrow Airport', iataCode: 'LHR', city: 'London', country: 'United Kingdom', type: 'AIRPORT' },
        { id: 'CDG', name: 'Charles de Gaulle Airport', iataCode: 'CDG', city: 'Paris', country: 'France', type: 'AIRPORT' },
        { id: 'LAX', name: 'Los Angeles International Airport', iataCode: 'LAX', city: 'Los Angeles', country: 'United States', type: 'AIRPORT' },
        { id: 'DXB', name: 'Dubai International Airport', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates', type: 'AIRPORT' }
      ];
    }
  }
);

const initialState = {
  // Search state
  searchParams: {
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    travelClass: 'ECONOMY',
    tripType: 'roundtrip',
  },
  
  // Results state
  flights: [],
  filteredFlights: [],
  totalFlights: 0,
  
  // Loading states
  loading: false,
  searchingAirports: false,
  
  // Error states
  error: null,
  
  // Airport suggestions
  airportSuggestions: [],
  airportCache: {},
  popularAirports: [
    { id: 'JFK', name: 'John F Kennedy International Airport', iataCode: 'JFK', city: 'New York', country: 'United States' },
    { id: 'LAX', name: 'Los Angeles International Airport', iataCode: 'LAX', city: 'Los Angeles', country: 'United States' },
    { id: 'LHR', name: 'London Heathrow Airport', iataCode: 'LHR', city: 'London', country: 'United Kingdom' },
    { id: 'CDG', name: 'Charles de Gaulle Airport', iataCode: 'CDG', city: 'Paris', country: 'France' },
    { id: 'DXB', name: 'Dubai International Airport', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
    { id: 'NRT', name: 'Narita International Airport', iataCode: 'NRT', city: 'Tokyo', country: 'Japan' },
    { id: 'SYD', name: 'Sydney Kingsford Smith Airport', iataCode: 'SYD', city: 'Sydney', country: 'Australia' },
    { id: 'FRA', name: 'Frankfurt Airport', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany' },
    { id: 'SIN', name: 'Singapore Changi Airport', iataCode: 'SIN', city: 'Singapore', country: 'Singapore' },
    { id: 'AMS', name: 'Amsterdam Airport Schiphol', iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands' }
  ],
  
  // Filters
  filters: {
    priceRange: [0, 5000],
    stops: 'all', // 'all', 'nonstop', '1stop', '2+stops'
    airlines: [],
    departureTime: 'all', // 'morning', 'afternoon', 'evening', 'night', 'all'
    duration: 'all',
  },
  
  // Sorting
  sortBy: 'price', // 'price', 'duration', 'departure', 'arrival'
  sortOrder: 'asc', // 'asc', 'desc'
};

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    updateSearchParams: (state, action) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    
    clearSearchResults: (state) => {
      state.flights = [];
      state.filteredFlights = [];
      state.totalFlights = 0;
      state.error = null;
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Apply filters to flights
      state.filteredFlights = applyFilters(state.flights, state.filters);
    },
    
    updateSort: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
      // Apply sorting to filtered flights
      state.filteredFlights = applySorting(state.filteredFlights, sortBy, sortOrder);
    },
    
    clearAirportSuggestions: (state) => {
      state.airportSuggestions = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Search flights
    builder
      .addCase(searchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload.flights || [];
        state.totalFlights = action.payload.count || 0;
        state.filteredFlights = applyFilters(state.flights, state.filters);
        state.filteredFlights = applySorting(state.filteredFlights, state.sortBy, state.sortOrder);
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.flights = [];
        state.filteredFlights = [];
        state.totalFlights = 0;
      });
    
    // Search airports
    builder
      .addCase(searchAirports.pending, (state) => {
        state.searchingAirports = true;
      })
      .addCase(searchAirports.fulfilled, (state, action) => {
        state.searchingAirports = false;
        state.airportSuggestions = action.payload.airports || [];
        
        // Cache the results if we have a cache key
        if (action.payload.cacheKey && action.payload.timestamp) {
          state.airportCache[action.payload.cacheKey] = {
            data: action.payload.airports || [],
            timestamp: action.payload.timestamp
          };
        }
      })
      .addCase(searchAirports.rejected, (state, action) => {
        state.searchingAirports = false;
        state.airportSuggestions = [];
      });
    
    // Load popular airports
    builder
      .addCase(loadPopularAirports.pending, (state) => {
        // Keep current popular airports while loading
      })
      .addCase(loadPopularAirports.fulfilled, (state, action) => {
        state.popularAirports = action.payload;
      })
      .addCase(loadPopularAirports.rejected, (state, action) => {
        // Keep fallback popular airports if loading fails
        console.warn('Failed to load popular airports, using fallback');
      });
  },
});

// Helper functions for filtering and sorting
function applyFilters(flights, filters) {
  return flights.filter(flight => {
    // Price filter
    if (flight.price < filters.priceRange[0] || flight.price > filters.priceRange[1]) {
      return false;
    }
    
    // Stops filter
    if (filters.stops !== 'all') {
      if (filters.stops === 'nonstop' && flight.stops > 0) return false;
      if (filters.stops === '1stop' && flight.stops !== 1) return false;
      if (filters.stops === '2+stops' && flight.stops < 2) return false;
    }
    
    // Airlines filter
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }
    
    // Departure time filter
    if (filters.departureTime !== 'all') {
      const hour = new Date(flight.departureTime).getHours();
      if (filters.departureTime === 'morning' && (hour < 6 || hour >= 12)) return false;
      if (filters.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (filters.departureTime === 'evening' && (hour < 18 || hour >= 24)) return false;
      if (filters.departureTime === 'night' && (hour >= 6)) return false;
    }
    
    return true;
  });
}

function applySorting(flights, sortBy, sortOrder) {
  const sorted = [...flights].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'duration':
        aValue = parseDuration(a.duration);
        bValue = parseDuration(b.duration);
        break;
      case 'departure':
        aValue = new Date(a.departureTime);
        bValue = new Date(b.departureTime);
        break;
      case 'arrival':
        aValue = new Date(a.arrivalTime);
        bValue = new Date(b.arrivalTime);
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return sorted;
}

function parseDuration(duration) {
  // Parse PT5H30M format to minutes
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  return hours * 60 + minutes;
}

export const {
  updateSearchParams,
  clearSearchResults,
  updateFilters,
  updateSort,
  clearAirportSuggestions,
  clearError,
} = flightSlice.actions;

// Export async thunks
export { searchAirports, loadPopularAirports };

export default flightSlice.reducer;