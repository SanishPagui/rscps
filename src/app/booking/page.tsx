"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/navbar";

const SearchBookingsPage = () => {
  type Driver = {
    id: string;
    name: string;
    email: string;
    fromLocations: string[];
    toLocations: string[];
  };
  
  type Ride = {
    id: string;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: number;
    price: number;
    driver: {
      name: string;
      email: string;
    };
    availableSeats?: number;
  };
  
  type Booking = {
    id: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    seats: number;
    ride: Ride;
  };
  
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [bookingType, setBookingType] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fromDrivers, setFromDrivers] = useState<Driver[]>([]);
  const [toDrivers, setToDrivers] = useState<Driver[]>([]);
  const [showFromRecommendations, setShowFromRecommendations] = useState(false);
  const [showToRecommendations, setShowToRecommendations] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // Sample drivers data with Goa locations
  const drivers: Driver[] = [
    { id: "1", name: "Conrad", email: "conrad@example.com", fromLocations: ["Panjim", "Mapusa", "Calangute"], toLocations: ["Vasco", "Margao", "Ponda"] },
    { id: "2", name: "Johann", email: "johann@example.com", fromLocations: ["Margao", "Colva", "Canacona"], toLocations: ["Panjim", "Porvorim", "Bicholim"] },
    { id: "3", name: "Audumber", email: "audumber@example.com", fromLocations: ["Panjim", "Dona Paula", "Bambolim"], toLocations: ["Margao", "Verna", "Quepem"] },
    { id: "4", name: "Sanish", email: "sanish@example.com", fromLocations: ["Vasco", "Bogmalo", "Dabolim"], toLocations: ["Margao", "Panjim", "Sanguem"] },
    { id: "5", name: "Chirag", email: "chirag@example.com", fromLocations: ["Margao", "Benaulim", "Majorda"], toLocations: ["Panjim", "Candolim", "Anjuna"] },
    { id: "6", name: "Priya", email: "priya@example.com", fromLocations: ["Panjim", "Ribandar", "Old Goa"], toLocations: ["Vasco", "Curchorem", "Sanvordem"] },
    { id: "7", name: "Rahul", email: "rahul@example.com", fromLocations: ["Mapusa", "Assagao", "Siolim"], toLocations: ["Margao", "Navelim", "Cuncolim"] },
    { id: "8", name: "Nina", email: "nina@example.com", fromLocations: ["Margao", "Fatorda", "Nuvem"], toLocations: ["Panjim", "Merces", "Panaji"] },
    { id: "9", name: "Vikram", email: "vikram@example.com", fromLocations: ["Panjim", "Caranzalem", "Miramar"], toLocations: ["Margao", "Ponda", "Dharbandora"] },
    { id: "10", name: "Divya", email: "divya@example.com", fromLocations: ["Margao", "Aquem", "Gogol"], toLocations: ["Panjim", "Taleigao", "St. Cruz"] },
    { id: "11", name: "Rohan", email: "rohan@example.com", fromLocations: ["Vasco", "Mormugao", "Headland Sada"], toLocations: ["Margao", "Panjim", "Pernem"] },
    { id: "12", name: "Aisha", email: "aisha@example.com", fromLocations: ["Panjim", "Altinho", "Fontainhas"], toLocations: ["Vasco", "Margao", "Canacona"] },
    { id: "13", name: "Karan", email: "karan@example.com", fromLocations: ["Margao", "Comba", "Monte"], toLocations: ["Panjim", "Mapusa", "Aldona"] },
    { id: "14", name: "Leela", email: "leela@example.com", fromLocations: ["Panjim", "Campal", "Tonca"], toLocations: ["Margao", "Majorda", "Betalbatim"] },
    { id: "15", name: "Jay", email: "jay@example.com", fromLocations: ["Margao", "Davorlim", "Rawanfond"], toLocations: ["Panjim", "Pilerne", "Socorro"] }
  ];

  useEffect(() => {
    fetchRides();
    fetchBookings();
  }, []);

  useEffect(() => {
    updateDriverRecommendations();
  }, [searchParams.from, searchParams.to]);

  const updateDriverRecommendations = () => {
    if (searchParams.from.trim()) {
      const matchingFromDrivers = drivers.filter(driver => 
        driver.fromLocations.some(location => 
          location.toLowerCase().includes(searchParams.from.toLowerCase()))
      ).slice(0, 5);
      setFromDrivers(matchingFromDrivers);
    } else {
      setFromDrivers([]);
    }

    if (searchParams.to.trim()) {
      const matchingToDrivers = drivers.filter(driver => 
        driver.toLocations.some(location => 
          location.toLowerCase().includes(searchParams.to.toLowerCase()))
      ).slice(0, 5);
      setToDrivers(matchingToDrivers);
    } else {
      setToDrivers([]);
    }
  };

  const handleDriverSelection = (driver: Driver, locationType: 'from' | 'to') => {
    setSelectedDriver(driver.name);
    
    // Get matching locations based on input
    const relevantLocations = locationType === 'from' 
      ? driver.fromLocations.filter(loc => 
          loc.toLowerCase().includes(searchParams.from.toLowerCase())
        )
      : driver.toLocations.filter(loc => 
          loc.toLowerCase().includes(searchParams.to.toLowerCase())
        );
    
    // Select the first matching location, prioritizing Panjim or Margao
    let selectedLocation = "";
    
    // First try to find Panjim or Margao if they match
    const priorityLocation = relevantLocations.find(loc => 
      loc === "Panjim" || loc === "Margao"
    );
    
    if (priorityLocation) {
      selectedLocation = priorityLocation;
    } else if (relevantLocations.length > 0) {
      // Otherwise use the first matching location
      selectedLocation = relevantLocations[0];
    }
    
    if (selectedLocation) {
      if (locationType === 'from') {
        setSearchParams(prev => ({ ...prev, from: selectedLocation }));
        setShowFromRecommendations(false);
      } else {
        setSearchParams(prev => ({ ...prev, to: selectedLocation }));
        setShowToRecommendations(false);
      }
      
      // Auto-search for rides if both from and to are filled
      if (searchParams.from && searchParams.to) {
        handleSearch(new Event('submit') as any);
      }
    }
  };

  const handleDriverRecommendationClick = (driver: Driver, location: string, locationType: 'from' | 'to') => {
    setSelectedDriver(driver.name);
    
    if (locationType === 'from') {
      setSearchParams(prev => ({ ...prev, from: location }));
      setShowFromRecommendations(false);
    } else {
      setSearchParams(prev => ({ ...prev, to: location }));
      setShowToRecommendations(false);
    }
    
    // Auto-search for rides if both from and to are filled
    const otherFieldFilled = locationType === 'from' ? searchParams.to : searchParams.from;
    if (otherFieldFilled) {
      setTimeout(() => handleSearch(new Event('submit') as any), 100);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        ...(searchParams.from && { from: searchParams.from }),
        ...(searchParams.to && { to: searchParams.to }),
        ...(searchParams.date && { date: searchParams.date })
      }).toString();
  
      const res = await fetch(`/api/rides${queryParams ? `?${queryParams}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to search rides');
      const data = await res.json();
      setRides(data);
      
      // If a driver was selected, prioritize their rides
      if (selectedDriver) {
        const driverRides = data.filter((ride: Ride) => ride.driver.name === selectedDriver);
        const otherRides = data.filter((ride: Ride) => ride.driver.name !== selectedDriver);
        setRides([...driverRides, ...otherRides]);
      }
      
      setSuccess('Search completed successfully');
    } catch (error) {
      setError('Failed to search rides');
      console.error('Error searching rides:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rides', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch rides');
      }
      const data = await res.json();
      setRides(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setError('Failed to fetch rides');
    }
    setLoading(false);
  };
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');  
      } 
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    }
    setLoading(false);
  };
  
  const handleBookRide = async (rideId: string, seats: number) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ rideId, seats }),
      });
  
      if (!res.ok) throw new Error('Failed to book ride');
      await fetchBookings();
      setSuccess('Ride booked successfully');
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Failed to book ride');
    }
  };
  
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
  
      if (!res.ok) throw new Error('Failed to cancel booking');
      await fetchBookings();
      setSuccess('Booking cancelled successfully');
    } catch (error) {
      console.error('Cancellation failed:', error);
      setError('Failed to cancel booking');
    }
  };

  const isUpcomingBooking = (booking: Booking) => {
    return new Date(booking.ride.date) > new Date() && 
           booking.status !== 'CANCELLED' && 
           booking.status !== 'COMPLETED';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        {/* Tab Switcher */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${activeTab === "search" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("search")}
          >
            Search Rides
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "bookings" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("bookings")}
          >
            My Bookings
          </button>
        </div>

        {activeTab === "search" ? (
          // Search Rides Section
          <div>
            <form onSubmit={handleSearch} className="mb-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="From"
                    value={searchParams.from}
                    onChange={(e) => {
                      setSearchParams({ ...searchParams, from: e.target.value });
                      setShowFromRecommendations(true);
                    }}
                    onFocus={() => setShowFromRecommendations(true)}
                    className="p-2 border rounded w-full"
                  />
                  {showFromRecommendations && fromDrivers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                      {fromDrivers.map(driver => (
                        <div key={driver.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                          <div 
                            className="font-medium text-indigo-600"
                            onClick={() => handleDriverSelection(driver, 'from')}
                          >
                            {driver.name}
                          </div>
                          <div className="text-sm">
                            {driver.fromLocations
                              .filter(loc => loc.toLowerCase().includes(searchParams.from.toLowerCase()))
                              .map((location, idx) => (
                                <div 
                                  key={idx}
                                  className="mt-1 pl-4 py-1 hover:bg-indigo-50 rounded"
                                  onClick={() => handleDriverRecommendationClick(driver, location, 'from')}
                                >
                                  {location}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="To"
                    value={searchParams.to}
                    onChange={(e) => {
                      setSearchParams({ ...searchParams, to: e.target.value });
                      setShowToRecommendations(true);
                    }}
                    onFocus={() => setShowToRecommendations(true)}
                    className="p-2 border rounded w-full"
                  />
                  {showToRecommendations && toDrivers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                      {toDrivers.map(driver => (
                        <div key={driver.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                          <div 
                            className="font-medium text-indigo-600"
                            onClick={() => handleDriverSelection(driver, 'to')}
                          >
                            {driver.name}
                          </div>
                          <div className="text-sm">
                            {driver.toLocations
                              .filter(loc => loc.toLowerCase().includes(searchParams.to.toLowerCase()))
                              .map((location, idx) => (
                                <div 
                                  key={idx}
                                  className="mt-1 pl-4 py-1 hover:bg-indigo-50 rounded"
                                  onClick={() => handleDriverRecommendationClick(driver, location, 'to')}
                                >
                                  {location}
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="date"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                  className="p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Rides'}
              </button>
            </form>
            
            {selectedDriver && (
              <div className="mb-4 p-3 bg-indigo-50 text-indigo-700 rounded flex justify-between items-center">
                <div>
                  <span className="font-medium">Selected driver: {selectedDriver}</span>
                  {searchParams.from && searchParams.to && (
                    <p className="text-sm">Route: {searchParams.from} → {searchParams.to}</p>
                  )}
                </div>
                <button 
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setSelectedDriver(null);
                    fetchRides();
                  }}
                >
                  Clear selection
                </button>
              </div>
            )}
            
            <div className="space-y-4">
              {loading ? (
                <p>Loading rides...</p>
              ) : rides.length > 0 ? (
                rides.map((ride) => (
                  <div key={ride.id} className={`border rounded-lg p-4 hover:shadow-md ${selectedDriver && ride.driver.name === selectedDriver ? 'border-indigo-300 bg-indigo-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ride.from} → {ride.to}</h3>
                        <p className="text-sm text-gray-600">{ride.date} at {ride.time}</p>
                        <p className={`text-sm ${selectedDriver && ride.driver.name === selectedDriver ? 'font-medium text-indigo-600' : 'text-gray-600'}`}>
                          Driver: {ride.driver.name}
                          {selectedDriver && ride.driver.name === selectedDriver && ' (Selected)'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-indigo-600">Rs.{ride.price}</p>
                        <p className="text-sm text-gray-600">{ride.seats} seats left</p>
                      </div>
                    </div>
                    <button
                      className={`mt-4 w-full p-2 rounded hover:bg-indigo-700 transition-colors ${
                        selectedDriver && ride.driver.name === selectedDriver
                          ? 'bg-indigo-700 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                      onClick={() => handleBookRide(ride.id, 1)}
                    >
                      Book Ride
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No rides found for your search criteria.</p>
              )}
            </div>
          </div>
        ) : (
          // My Bookings Section
          <div>
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${bookingType === "upcoming" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                onClick={() => setBookingType("upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded ${bookingType === "past" ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                onClick={() => setBookingType("past")}
              >
                Past
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.filter((booking) => 
                    bookingType === 'upcoming' 
                      ? isUpcomingBooking(booking)
                      : !isUpcomingBooking(booking)
                  ).length > 0 ? (
                bookings
                  .filter((booking) => 
                    bookingType === 'upcoming' 
                      ? isUpcomingBooking(booking)
                      : !isUpcomingBooking(booking)
                  )
                  .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{booking.ride.from} → {booking.ride.to}</h3>
                          <p className="text-sm text-gray-600">{booking.ride.date} at {booking.ride.time}</p>
                          <p className="text-sm text-gray-600">Driver: {booking.ride.driver.name}</p>
                          <p className="text-sm font-medium mt-2">Status: 
                            <span className={`ml-1 ${
                              booking.status === 'CONFIRMED' ? 'text-green-600' :
                              booking.status === 'PENDING' ? 'text-yellow-600' :
                              booking.status === 'CANCELLED' ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {booking.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-indigo-600">Rs.{booking.ride.price}</p>
                          <p className="text-sm text-gray-600">Seats: {booking.seats}</p>
                        </div>
                      </div>
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                        <button
                          className="mt-4 w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-600">No {bookingType} bookings found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookingsPage;