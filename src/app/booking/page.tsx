'use client'

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
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
          <div>
            <form onSubmit={handleSearch} className="mb-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="From"
                  value={searchParams.from}
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="To"
                  value={searchParams.to}
                  onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                  className="p-2 border rounded"
                />
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

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading rides...</p>
                </div>
              ) : rides.length > 0 ? (
                rides.map((ride) => (
                  <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ride.from} → {ride.to}</h3>
                        <p className="text-sm text-gray-600">{ride.date} at {ride.time}</p>
                        <p className="text-sm text-gray-600">Driver: {ride.driver.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-indigo-600">Rs.{ride.price}</p>
                        <p className="text-sm text-gray-600">{ride.availableSeats} seats left</p>
                      </div>
                    </div>
                    <button
                      className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors"
                      onClick={() => handleBookRide(ride.id, 1)}
                      disabled={!ride.availableSeats || ride.availableSeats < 1}
                    >
                      {ride.availableSeats && ride.availableSeats > 0 ? 'Book Ride' : 'No Seats Available'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No rides available for your search criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search parameters or check back later.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
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
                <div className="text-center py-4">
                  <p className="text-gray-600">Loading bookings...</p>
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
                <div className="text-center py-8">
                  <p className="text-gray-600">No {bookingType} bookings found.</p>
                  {bookingType === 'upcoming' && (
                    <p className="text-sm text-gray-500 mt-2">Search for rides to make a booking.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookingsPage;