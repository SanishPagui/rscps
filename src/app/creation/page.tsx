"use client"
import React from 'react';
import { useState } from 'react';
import { Bell, Calendar, Car, CreditCard, MapPin, Search, Settings, User } from 'lucide-react';
import Navbar from '../components/navbar';


// Create Ride Page
const CreateRidePage = () => {
  const [rideDetails, setRideDetails] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '',
    price: ''
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a Ride</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <MapPin className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Pickup Location"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Drop-off Location"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="p-2 border rounded" />
          <input type="time" className="p-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Available Seats"
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price per Seat"
            className="p-2 border rounded"
          />
        </div>
        <button className="w-full bg-indigo-600 text-white p-3 rounded font-medium">
          Create Ride
        </button>
      </div>
    </div>
  );
};

// Search Rides Page
const SearchRidesPage = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: ''
  });

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

  return (
    <div className="max-w-2xl mx-auto p-6">
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
            <button className="mt-4 w-full bg-indigo-600 text-white p-2 rounded">
              Book Ride
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Booking Management Page
const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'past' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Past
        </button>
      </div>

      <div className="space-y-4">
        {bookings
          .filter(booking => booking.type === activeTab)
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
  );
};

// User Profile Page
const ProfilePage = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4">
          <User className="w-full h-full p-4 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-gray-600">john.doe@example.com</p>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-4">Vehicle Information</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-gray-500" />
              <span>Toyota Camry (2022)</span>
            </div>
            <p className="text-gray-600">License: ABC 123</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-4">Payment Methods</h2>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <span>•••• •••• •••• 4242</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-medium mb-4">Preferences</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex items-center justify-between">
              <span>Language</span>
              <span className="text-gray-600">English</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <CreateRidePage />
      <SearchRidesPage />
      <BookingsPage />
      <ProfilePage />
    </div>
  );
};

export default page;