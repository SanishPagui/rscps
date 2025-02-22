'use client'

import React, { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Clock, Users, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "../components/navbar";
import { useAuthToken } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

const SearchBookingsPage = () => {
  const router = useRouter();

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
  const { token, loading: authLoading } = useAuthToken();

  const [rides, setRides] = useState<Ride[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("search");
  const [bookingType, setBookingType] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();
    fetchBookings();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please sign in to continue');
      router.push('/auth'); // Redirect to auth page
      return;
    }
  
    const rideDetails = {
      from: searchParams.from,  // Origin location (string)
      to: searchParams.to,      // Destination location (string)
      date: searchParams.date,  // Date of the ride (YYYY-MM-DD format)
      time: "HH:MM",            // Time of the ride (24-hour format)
      seats: 4,                 // Total seats available (number)
      price: 500                // Price per seat (number)
    };
    
  
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rideDetails)
      });
    } catch (error) {
      setError('Failed to search rides');
      console.error('Error searching rides:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRides = async () => {
    setLoading(true);
    if (!token) {
      setError('Please sign in to view rides');
      return;
    }
    
    try {
      const res = await fetch('/api/rides', {
        headers: {
          'Authorization': `Bearer ${token}`
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
    if (!token) {
      setError('Please sign in to view bookings');
      return;
    }
    
    try {
      const res = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
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

  const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles = {
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-4 mb-8">
            <button
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "search"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("search")}
            >
              Search Rides
            </button>
            <button
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "bookings"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              My Bookings
            </button>
          </div>

          {activeTab === "search" ? (
            <div>
              <form onSubmit={handleSearch} className="mb-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="From"
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="To"
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Rides
                    </>
                  )}
                </button>
              </form>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading rides...</p>
                  </div>
                ) : rides.length > 0 ? (
                  rides.map((ride) => (
                    <div key={ride.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold">{ride.from}</h3>
                            <ChevronRight className="mx-2 text-gray-400" />
                            <h3 className="text-lg font-semibold">{ride.to}</h3>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{ride.date}</span>
                            <Clock className="w-4 h-4 ml-4 mr-2" />
                            <span>{ride.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Driver: {ride.driver.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">₹{ride.price}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} left
                          </p>
                        </div>
                      </div>
                      <button
                        className={`mt-4 w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          ride.availableSeats && ride.availableSeats > 0
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 transform hover:-translate-y-0.5"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleBookRide(ride.id, 1)}
                        disabled={!ride.availableSeats || ride.availableSeats < 1}
                      >
                        {ride.availableSeats && ride.availableSeats > 0 ? 'Book Ride' : 'No Seats Available'}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No rides available for your search criteria.</p>
                    <p className="text-gray-500 mt-2">Try adjusting your search parameters or check back later.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex space-x-4 mb-8">
                <button
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    bookingType === "upcoming"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setBookingType("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                    bookingType === "past"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform -translate-y-0.5"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setBookingType("past")}
                >
                  Past
                </button>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading bookings...</p>
                  </div>
                ) : bookings.filter(booking => 
                      bookingType === 'upcoming' 
                        ? isUpcomingBooking(booking)
                        : !isUpcomingBooking(booking)
                    ).length > 0 ? (
                  bookings
                    .filter(booking => 
                      bookingType === 'upcoming' 
                        ? isUpcomingBooking(booking)
                        : !isUpcomingBooking(booking)
                    )
                    .map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold">{booking.ride.from}</h3>
                              <ChevronRight className="mx-2 text-gray-400" />
                              <h3 className="text-lg font-semibold">{booking.ride.to}</h3>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{booking.ride.date}</span>
                              <Clock className="w-4 h-4 ml-4 mr-2" />
                              <span>{booking.ride.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              <span>Driver: {booking.ride.driver.name}</span>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">₹{booking.ride.price}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'} booked
                            </p>
                          </div>
                        </div>
                        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                          <button
                            className="mt-4 w-full py-3 px-4 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 transform hover:-translate-y-0.5 focus:ring-4 focus:ring-red-200"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No {bookingType} bookings found.</p>
                    {bookingType === 'upcoming' && (
                      <p className="text-gray-500 mt-2">
                        Looking for a ride? Head over to the Search tab to book your next journey.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBookingsPage;