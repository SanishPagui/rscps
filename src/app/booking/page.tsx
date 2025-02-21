"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';
import Navbar from '../components/navbar';

// Locations data
const locations = [
  'Bicholim', 'Canacona', 'Cuncolim', 'Curchorem', 'Mapusa',
  'Margao', 'Mormugao', 'Panaji', 'Parnem', 'Ponda',
  'Quepem', 'Sanguem', 'Sanquelim', 'Valpoi'
];

// Properly define location type using string literal union
type Location = typeof locations[number] | 'Airport';

// Correct DistanceMatrix type
type DistanceMatrix = {
  [key in typeof locations[number]]: Partial<Record<typeof locations[number], number>>;
};

// Distance matrix (approximate distances in km between locations)
const distanceMatrix: DistanceMatrix = {
  'Bicholim': {
    'Canacona': 78, 'Cuncolim': 58, 'Curchorem': 48, 'Mapusa': 18,
    'Margao': 48, 'Mormugao': 50, 'Panaji': 25, 'Parnem': 32,
    'Ponda': 28, 'Quepem': 50, 'Sanguem': 55, 'Sanquelim': 10, 'Valpoi': 25
  },
  'Canacona': {
    'Bicholim': 78, 'Cuncolim': 25, 'Curchorem': 42, 'Mapusa': 80,
    'Margao': 36, 'Mormugao': 60, 'Panaji': 76, 'Parnem': 95,
    'Ponda': 55, 'Quepem': 32, 'Sanguem': 40, 'Sanquelim': 85, 'Valpoi': 90
  },
  'Cuncolim': {
    'Bicholim': 58, 'Canacona': 25, 'Curchorem': 20, 'Mapusa': 60,
    'Margao': 15, 'Mormugao': 35, 'Panaji': 56, 'Parnem': 75,
    'Ponda': 32, 'Quepem': 12, 'Sanguem': 30, 'Sanquelim': 65, 'Valpoi': 70
  },
  'Curchorem': {
    'Bicholim': 48, 'Canacona': 42, 'Cuncolim': 20, 'Mapusa': 50,
    'Margao': 30, 'Mormugao': 45, 'Panaji': 50, 'Parnem': 65,
    'Ponda': 25, 'Quepem': 15, 'Sanguem': 18, 'Sanquelim': 55, 'Valpoi': 60
  },
  'Mapusa': {
    'Bicholim': 18, 'Canacona': 80, 'Cuncolim': 60, 'Curchorem': 50,
    'Margao': 50, 'Mormugao': 40, 'Panaji': 13, 'Parnem': 20,
    'Ponda': 33, 'Quepem': 55, 'Sanguem': 62, 'Sanquelim': 22, 'Valpoi': 30
  },
  'Margao': {
    'Bicholim': 48, 'Canacona': 36, 'Cuncolim': 15, 'Curchorem': 30,
    'Mapusa': 50, 'Mormugao': 25, 'Panaji': 35, 'Parnem': 70,
    'Ponda': 25, 'Quepem': 18, 'Sanguem': 40, 'Sanquelim': 58, 'Valpoi': 65
  },
  'Mormugao': {
    'Bicholim': 50, 'Canacona': 60, 'Cuncolim': 35, 'Curchorem': 45,
    'Mapusa': 40, 'Margao': 25, 'Panaji': 30, 'Parnem': 60,
    'Ponda': 35, 'Quepem': 38, 'Sanguem': 55, 'Sanquelim': 60, 'Valpoi': 70
  },
  'Panaji': {
    'Bicholim': 25, 'Canacona': 76, 'Cuncolim': 56, 'Curchorem': 50,
    'Mapusa': 13, 'Margao': 35, 'Mormugao': 30, 'Parnem': 32,
    'Ponda': 28, 'Quepem': 48, 'Sanguem': 60, 'Sanquelim': 32, 'Valpoi': 45
  },
  'Parnem': {
    'Bicholim': 32, 'Canacona': 95, 'Cuncolim': 75, 'Curchorem': 65,
    'Mapusa': 20, 'Margao': 70, 'Mormugao': 60, 'Panaji': 32,
    'Ponda': 45, 'Quepem': 72, 'Sanguem': 80, 'Sanquelim': 35, 'Valpoi': 40
  },
  'Ponda': {
    'Bicholim': 28, 'Canacona': 55, 'Cuncolim': 32, 'Curchorem': 25,
    'Mapusa': 33, 'Margao': 25, 'Mormugao': 35, 'Panaji': 28, 'Parnem': 45,
    'Quepem': 35, 'Sanguem': 30, 'Sanquelim': 32, 'Valpoi': 40
  },
  'Quepem': {
    'Bicholim': 50, 'Canacona': 32, 'Cuncolim': 12, 'Curchorem': 15,
    'Mapusa': 55, 'Margao': 18, 'Mormugao': 38, 'Panaji': 48, 'Parnem': 72,
    'Ponda': 35, 'Sanguem': 20, 'Sanquelim': 58, 'Valpoi': 65
  },
  'Sanguem': {
    'Bicholim': 55, 'Canacona': 40, 'Cuncolim': 30, 'Curchorem': 18,
    'Mapusa': 62, 'Margao': 40, 'Mormugao': 55, 'Panaji': 60, 'Parnem': 80,
    'Ponda': 30, 'Quepem': 20, 'Sanquelim': 62, 'Valpoi': 58
  },
  'Sanquelim': {
    'Bicholim': 10, 'Canacona': 85, 'Cuncolim': 65, 'Curchorem': 55,
    'Mapusa': 22, 'Margao': 58, 'Mormugao': 60, 'Panaji': 32, 'Parnem': 35,
    'Ponda': 32, 'Quepem': 58, 'Sanguem': 62, 'Valpoi': 18
  },
  'Valpoi': {
    'Bicholim': 25, 'Canacona': 90, 'Cuncolim': 70, 'Curchorem': 60,
    'Mapusa': 30, 'Margao': 65, 'Mormugao': 70, 'Panaji': 45, 'Parnem': 40,
    'Ponda': 40, 'Quepem': 65, 'Sanguem': 58, 'Sanquelim': 18
  }
};

// Define the driver type
type Driver = {
  id: number;
  name: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  basePrice: number;
  pricePerKm: number;
  rating: number;
  vehicle: string;
  estimatedCost: number;
};

// Driver data with their routes and pricing
const drivers: Driver[] = [
  {
    id: 1,
    name: "Johann",
    from: "Margao",
    to: "Airport",
    date: "2025-02-22",
    time: "09:00",
    seats: 3,
    basePrice: 25,
    pricePerKm: 1.2,
    rating: 4.8,
    vehicle: "Maruti Suzuki Swift",
    estimatedCost: Math.round(25 + (1.2 * 25))
  },
  {
    id: 2,
    name: "Conrad",
    from: "Ponda",
    to: "Panaji",
    date: "2025-02-22",
    time: "08:30",
    seats: 4,
    basePrice: 20,
    pricePerKm: 1.0,
    rating: 4.5,
    vehicle: "Honda City",
    estimatedCost: Math.round(20 + (1.0 * 28))
  },
  {
    id: 3,
    name: "Audumber",
    from: "Bicholim",
    to: "Mapusa",
    date: "2025-02-22",
    time: "10:15",
    seats: 2,
    basePrice: 15,
    pricePerKm: 1.1,
    rating: 4.7,
    vehicle: "Hyundai i20",
    estimatedCost: Math.round(15 + (1.1 * 31))
  },
  {
    id: 4,
    name: "Sanish",
    from: "Valpoi",
    to: "Ponda",
    date: "2025-02-22",
    time: "11:00",
    seats: 3,
    basePrice: 22,
    pricePerKm: 1.3,
    rating: 4.6,
    vehicle: "Tata Nexon",
    estimatedCost: Math.round(22 + (1.3 * 26))
  },
  {
    id: 5,
    name: "Maria",
    from: "Panaji",
    to: "Mormugao",
    date: "2025-02-22",
    time: "09:30",
    seats: 2,
    basePrice: 18,
    pricePerKm: 1.0,
    rating: 4.9,
    vehicle: "Kia Sonet",
    estimatedCost: Math.round(18 + (1.0 * 29))
  },
  {
    id: 6,
    name: "Rakesh",
    from: "Cuncolim",
    to: "Margao",
    date: "2025-02-22",
    time: "14:00",
    seats: 4,
    basePrice: 14,
    pricePerKm: 0.9,
    rating: 4.4,
    vehicle: "Maruti Suzuki Ertiga",
    estimatedCost: Math.round(14 + (0.9 * 32))
  },
  {
    id: 7,
    name: "Priya",
    from: "Mapusa",
    to: "Bicholim",
    date: "2025-02-22",
    time: "15:30",
    seats: 3,
    basePrice: 16,
    pricePerKm: 1.1,
    rating: 4.6,
    vehicle: "Hyundai Venue",
    estimatedCost: Math.round(16 + (1.1 * 25))
  },
  {
    id: 8,
    name: "Rohit",
    from: "Canacona",
    to: "Quepem",
    date: "2025-02-22",
    time: "10:00",
    seats: 2,
    basePrice: 24,
    pricePerKm: 1.4,
    rating: 4.8,
    vehicle: "Mahindra XUV300",
    estimatedCost: Math.round(24 + (1.4 * 28))
  },
  {
    id: 9,
    name: "Fernand",
    from: "Parnem",
    to: "Panaji",
    date: "2025-02-22",
    time: "07:45",
    seats: 4,
    basePrice: 23,
    pricePerKm: 1.2,
    rating: 4.7,
    vehicle: "Toyota Innova",
    estimatedCost: Math.round(23 + (1.2 * 31))
  },
  {
    id: 10,
    name: "Sejal",
    from: "Ponda",
    to: "Sanguem",
    date: "2025-02-22",
    time: "13:15",
    seats: 3,
    basePrice: 19,
    pricePerKm: 1.1,
    rating: 4.5,
    vehicle: "Renault Triber",
    estimatedCost: Math.round(19 + (1.1 * 26))
  },
  {
    id: 11,
    name: "Johann",
    from: "Curchorem",
    to: "Cuncolim",
    date: "2025-02-23",
    time: "09:30",
    seats: 2,
    basePrice: 17,
    pricePerKm: 1.0,
    rating: 4.7,
    vehicle: "Maruti Suzuki Baleno",
    estimatedCost: Math.round(17 + (1.0 * 29))
  },
  {
    id: 12,
    name: "Sanish",
    from: "Mormugao",
    to: "Margao",
    date: "2025-02-23",
    time: "10:45",
    seats: 3,
    basePrice: 21,
    pricePerKm: 1.2,
    rating: 4.8,
    vehicle: "Honda Amaze",
    estimatedCost: Math.round(21 + (1.2 * 32))
  },
  {
    id: 13,
    name: "Conrad",
    from: "Sanquelim",
    to: "Valpoi",
    date: "2025-02-23",
    time: "08:00",
    seats: 2,
    basePrice: 15,
    pricePerKm: 0.9,
    rating: 4.6,
    vehicle: "Tata Tiago",
    estimatedCost: Math.round(15 + (0.9 * 25))
  },
  {
    id: 14,
    name: "Audumber",
    from: "Mapusa",
    to: "Parnem",
    date: "2025-02-23",
    time: "11:30",
    seats: 4,
    basePrice: 22,
    pricePerKm: 1.3,
    rating: 4.9,
    vehicle: "Mahindra Scorpio",
    estimatedCost: Math.round(22 + (1.3 * 28))
  },
  {
    id: 15,
    name: "Nitin",
    from: "Quepem",
    to: "Canacona",
    date: "2025-02-23",
    time: "13:00",
    seats: 3,
    basePrice: 20,
    pricePerKm: 1.1,
    rating: 4.5,
    vehicle: "Hyundai Creta",
    estimatedCost: Math.round(20 + (1.1 * 31))
  }
];

// Define return type for the matching function
type MatchResult = {
  exactMatches: any[];
  partialMatches: any[];
  message: string;
};

// Location-based matching model
const matchUserWithDrivers = (userFrom: string, userTo: string, userDate: string): MatchResult => {
  // Filter available drivers by date
  const availableDrivers = drivers.filter(driver => driver.date === userDate);

  if (availableDrivers.length === 0) {
    return {
      exactMatches: [],
      partialMatches: [],
      message: "No drivers available on the selected date."
    };
  }

  // Find exact route matches (direct rides)
  const exactMatches = availableDrivers.filter(
    driver => driver.from.toLowerCase() === userFrom.toLowerCase() &&
      driver.to.toLowerCase() === userTo.toLowerCase()
  );

  // Find partial matches (drivers who pass through or near the requested locations)
  const partialMatches: (Driver & {
    totalDistance?: number;
    pickupDistance?: number;
    dropoffDistance?: number;
    isExactMatch?: boolean;
  })[] = [];

  // Check if locations are valid
  const isValidLocation = (loc: string) => locations.some(l =>
    l.toLowerCase() === loc.toLowerCase() ||
    loc.toLowerCase() === "airport"
  );

  const validUserFrom = isValidLocation(userFrom);
  const validUserTo = isValidLocation(userTo);

  if (!validUserFrom || !validUserTo) {
    return {
      exactMatches,
      partialMatches,
      message: "One or both locations are not recognized. Please select from the available locations."
    };
  }

  // Calculate costs for all available drivers
  availableDrivers.forEach(driver => {
    // Skip exact matches as they're already captured
    if (exactMatches.some(match => match.id === driver.id)) {
      return;
    }

    // Special case for Airport which isn't in our distance matrix
    const normalizeLocation = (loc: string) => loc.toLowerCase() === "airport" ? "Mormugao" : loc;

    const normalizedUserFrom = normalizeLocation(userFrom);
    const normalizedUserTo = normalizeLocation(userTo);
    const normalizedDriverFrom = normalizeLocation(driver.from);
    const normalizedDriverTo = normalizeLocation(driver.to);

    // Check if we have distance data for these locations
    if (!distanceMatrix[normalizedUserFrom as typeof locations[number]] ||
      !distanceMatrix[normalizedUserFrom as typeof locations[number]]?.[normalizedDriverFrom as typeof locations[number]] ||
      !distanceMatrix[normalizedUserTo as typeof locations[number]] ||
      !distanceMatrix[normalizedDriverTo as typeof locations[number]]?.[normalizedUserTo as typeof locations[number]]) {
      return;
    }

    // Calculate total distance and cost
    const pickupDistance = distanceMatrix[normalizedUserFrom as typeof locations[number]][normalizedDriverFrom as typeof locations[number]] || 0;
    const dropoffDistance = distanceMatrix[normalizedDriverTo as typeof locations[number]][normalizedUserTo as typeof locations[number]] || 0;
    const totalDistance = pickupDistance + dropoffDistance;

    // Calculate cost based on driver's pricing model
    const calculateEstimatedCost = (distance: number): number => {
      return Math.round(driver.basePrice + (driver.pricePerKm * distance));
    };

    // Determine if this is a feasible match
    if (totalDistance <= 40) {  // Only consider if total diversion is reasonable (40km or less)
      const estimatedCost = calculateEstimatedCost(totalDistance);
      partialMatches.push({
        ...driver,
        estimatedCost,
        totalDistance,
        pickupDistance,
        dropoffDistance,
        isExactMatch: false
      });
    }
  });

  // Sort partial matches by cost
  partialMatches.sort((a, b) => a.estimatedCost - b.estimatedCost);

  // Add exact cost calculation to exact matches
  const exactMatchesWithCost = exactMatches.map(driver => {
    const normalizeLocation = (loc: string) => loc.toLowerCase() === "airport" ? "Mormugao" : loc;
    const normalizedFrom = normalizeLocation(driver.from);
    const normalizedTo = normalizeLocation(driver.to);

    let distance = 25; // Default distance if exact calculation is not possible

    // Try to get actual distance if available
    if (distanceMatrix[normalizedFrom as typeof locations[number]] &&
      distanceMatrix[normalizedFrom as typeof locations[number]][normalizedTo as typeof locations[number]]) {
      distance = distanceMatrix[normalizedFrom as typeof locations[number]][normalizedTo as typeof locations[number]] || 0;
    }

    const estimatedCost = Math.round(driver.basePrice + (driver.pricePerKm * distance));

    return {
      ...driver,
      estimatedCost,
      totalDistance: distance,
      pickupDistance: 0,
      dropoffDistance: 0,
      isExactMatch: true
    };
  });

  // Sort exact matches by cost
  exactMatchesWithCost.sort((a, b) => a.estimatedCost - b.estimatedCost);

  return {
    exactMatches: exactMatchesWithCost,
    partialMatches,
    message: exactMatchesWithCost.length > 0 || partialMatches.length > 0
      ? "Found matching rides!"
      : "No suitable rides found. Try different locations or date."
  };
};

// Define booking type
type Booking = {
  id: number;
  type: 'upcoming' | 'past';
  from: string;
  to: string;
  date: string;
  time: string;
  driver: string;
  estimatedCost: number;
  status: string;
};

const SearchBookingsPage = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: '2025-02-22' // Default to Feb 22, 2025
  });

  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [matchResults, setMatchResults] = useState<MatchResult>({
    exactMatches: [],
    partialMatches: [],
    message: ""
  });
  const [isSearched, setIsSearched] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bookings: Booking[] = [
    {
      id: 1,
      type: 'upcoming',
      from: 'Margao',
      to: 'Airport',
      date: '2025-02-22',
      time: '09:00',
      driver: 'Johann',
      estimatedCost: 38,
      status: 'Confirmed'
    },
    {
      id: 2,
      type: 'past',
      from: 'Ponda',
      to: 'Panaji',
      date: '2025-02-18',
      time: '14:00',
      driver: 'Conrad',
      estimatedCost: 45,
      status: 'Completed'
    }
  ];

  const [bookingType, setBookingType] = useState('upcoming');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearch = () => {
    if (!searchParams.from || !searchParams.to || !searchParams.date) {
      setMatchResults({
        exactMatches: [],
        partialMatches: [],
        message: "Please fill in all search fields."
      });
      setIsSearched(true);
      return;
    }

    const results = matchUserWithDrivers(
      searchParams.from,
      searchParams.to,
      searchParams.date
    );

    setMatchResults(results);
    setIsSearched(true);
  };
  const handleBookRide = (ride: any) => {
    setSelectedRide(ride);
    setShowConfirmation(true);
  };

  const confirmBooking = () => {
    // Here you would actually save the booking to your backend
    // For demo purposes, we'll just close the confirmation dialog
    setShowConfirmation(false);
    setSelectedRide(null);

    // Switch to the bookings tab to show the "confirmed" booking
    setActiveTab('bookings');
    setBookingType('upcoming');
  };

  const cancelBooking = () => {
    setShowConfirmation(false);
    setSelectedRide(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        {/* Tab Switcher */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === 'search' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            onClick={() => setActiveTab('search')}
          >
            Search Rides
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        </div>

        {activeTab === 'search' ? (
          // Search Section
          <div>
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search rides..."
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                  <select
                    name="from"
                    value={searchParams.from}
                    onChange={handleInputChange}
                    className="p-2 pl-8 border rounded w-full appearance-none"
                  >
                    <option value="">From</option>
                    {locations.map(location => (
                      <option key={`from-${location}`} value={location}>{location}</option>
                    ))}
                    <option value="Airport">Airport</option>
                  </select>
                </div>
                <div className="relative">
                  <Navigation className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                  <select
                    name="to"
                    value={searchParams.to}
                    onChange={handleInputChange}
                    className="p-2 pl-8 border rounded w-full appearance-none"
                  >
                    <option value="">To</option>
                    {locations.map(location => (
                      <option key={`to-${location}`} value={location}>{location}</option>
                    ))}
                    <option value="Airport">Airport</option>
                  </select>
                </div>
                <input
                  type="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  min="2025-02-22"
                  max="2025-03-22"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Find Rides
              </button>
            </div>

            {isSearched && (
              <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-blue-800">{matchResults.message}</p>
              </div>
            )}

            {matchResults.exactMatches.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-lg">Direct Rides</h3>
                <div className="space-y-4">
                  {matchResults.exactMatches.map(ride => (
                    <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Direct</span>
                            <h3 className="font-medium">{ride.from} → {ride.to}</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {ride.time}
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-gray-600">
                              Driver: {ride.name} • {ride.vehicle}
                            </p>
                            <div className="ml-2 flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="text-xs ml-1">{ride.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">Rs.{ride.estimatedCost}</p>
                          <p className="text-sm text-gray-600">{ride.seats} seats left</p>
                          <p className="text-xs text-gray-500">{ride.totalDistance} km total</p>
                        </div>
                      </div>
                      <button
                        className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors"
                        onClick={() => handleBookRide(ride)}
                      >
                        Book Ride
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchResults.partialMatches.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-lg">Alternative Routes</h3>
                <div className="space-y-4">
                  {matchResults.partialMatches.map(ride => (
                    <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Connection</span>
                            <h3 className="font-medium">{ride.from} → {ride.to}</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {ride.time}
                          </p>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-gray-600">
                              Driver: {ride.name} • {ride.vehicle}
                            </p>
                            <div className="ml-2 flex items-center">
                              <span className="text-yellow-500">★</span>
                              <span className="text-xs ml-1">{ride.rating}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <p>Pickup: {searchParams.from} ({ride.pickupDistance} km from driver start)</p>
                            <p>Dropoff: {searchParams.to} ({ride.dropoffDistance} km from driver end)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">Rs.{ride.estimatedCost}</p>
                          <p className="text-sm text-gray-600">{ride.seats} seats left</p>
                          <p className="text-xs text-gray-500">{ride.totalDistance} km total</p>
                        </div>
                      </div>
                      <button
                        className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors"
                        onClick={() => handleBookRide(ride)}
                      >
                        Book Ride
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Bookings Section
          <div>
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${bookingType === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setBookingType('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded ${bookingType === 'past' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                  }`}
                onClick={() => setBookingType('past')}
              >
                Past
              </button>
            </div>

            <div className="space-y-4">
              {bookings
                .filter(booking => booking.type === bookingType)
                .map(booking => (
                  <div key={booking.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          {booking.from} → {booking.to}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Driver: {booking.driver} • Rs.{booking.estimatedCost}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'Confirmed'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                    {bookingType === 'upcoming' && (
                      <div className="mt-4 flex space-x-2">
                        <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded">
                          Contact Driver
                        </button>
                        <button className="px-4 py-2 bg-red-100 text-red-800 rounded">
                          Cancel Ride
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {showConfirmation && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Booking</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">{searchParams.from} → {searchParams.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium">
                  {new Date(selectedRide.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedRide.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-medium">{selectedRide.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-medium">{selectedRide.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost:</span>
                <span className="font-medium text-indigo-600">Rs.{selectedRide.estimatedCost}</span>
              </div>

              {!selectedRide.isExactMatch && (
                <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Connection Ride Information:</p>
                  <p>The driver will pick you up at {searchParams.from}, which is {selectedRide.pickupDistance}km from their starting point.</p>
                  <p>They will drop you at {searchParams.to}, which is {selectedRide.dropoffDistance}km from their end point.</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition-colors"
                onClick={cancelBooking}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                onClick={confirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBookingsPage;