"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/navbar";

const SearchBookingsPage = () => {
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

  useEffect(() => {
    fetchRides();
    fetchBookings();
  }, []);

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
  
      const res = await fetch(`/api/rides`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to search rides');
      const data = await res.json();
      setRides(data);
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
      if (!res.ok) 
      {
        throw new Error('Failed to fetch bookings');  
      } 
        const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
      // Add success message
    } catch (error) {
      console.error('Booking failed:', error);
      // Add error message ok
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
      // Add success message
    } catch (error) {
      console.error('Cancellation failed:', error);
      // Add error message
    }
  };

  const isUpcomingBooking = (booking: Booking) => {
    return new Date(booking.ride.date) > new Date() && 
           booking.status !== 'CANCELLED' && 
           booking.status !== 'COMPLETED';
  };
  const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

  

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
            <div className="mb-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search rides..."
                  className="w-full p-2 border rounded"
                  onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4">
              {loading ? (
                <p>Loading rides...</p>
              ) : (
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
                        <p className="text-sm text-gray-600">{ride.seats} seats left</p>
                      </div>
                    </div>
                    <button
                      className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors"
                      onClick={() => handleBookRide(ride.id, 1)}
                    >
                      Book Ride
                    </button>
                  </div>
                ))
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
              ) : (
                bookings
                  .filter((booking) => 
                    bookingType === 'upcoming' 
                      ? isUpcomingBooking(booking)
                      : !isUpcomingBooking(booking)
                  )
                  .map((booking) => (
                    <div key={booking.id}>
                      {/* Render booking details here */}
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookingsPage;
