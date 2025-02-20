"use client"
import React from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/navbar';

const SearchBookingsPage = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'bookings'

  const dummyRides = [
    {
      id: 1,
      driver: "Corny",
      from: "Margao",
      to: "Airport",
      date: "20/02/2025",
      time: "09:00",
      seats: 3,
      price: 25
    },
    {
      id: 2,
      driver: "Grass",
      from: "Farmagudi",
      to: "Ponda",
      date: "20/02/2025",
      time: "14:00",
      seats: 2,
      price: 15
    }
  ];

  const bookings = [
    {
      id: 1,
      type: 'upcoming',
      from: 'Downtown',
      to: 'Airport',
      date: '2025-02-20',
      time: '09:00',
      status: 'Confirmed'
    },
    {
      id: 2,
      type: 'past',
      from: 'Mall',
      to: 'University',
      date: '2025-02-18',
      time: '14:00',
      status: 'Completed'
    }
  ];

  const [bookingType, setBookingType] = useState('upcoming');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        {/* Tab Switcher */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'search' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('search')}
          >
            Search Rides
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
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
                <input type="text" placeholder="From" className="p-2 border rounded" />
                <input type="text" placeholder="To" className="p-2 border rounded" />
                <input type="date" className="p-2 border rounded" />
              </div>
            </div>

            <div className="space-y-4">
              {dummyRides.map(ride => (
                <div key={ride.id} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{ride.from} → {ride.to}</h3>
                      <p className="text-sm text-gray-600">
                        {ride.date} at {ride.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Driver: {ride.driver}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">Rs.{ride.price}</p>
                      <p className="text-sm text-gray-600">{ride.seats} seats left</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors">
                    Book Ride
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Bookings Section
          <div>
            <div className="flex space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded ${
                  bookingType === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setBookingType('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  bookingType === 'past' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
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
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {booking.from} → {booking.to}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'Confirmed' 
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookingsPage;