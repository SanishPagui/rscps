'use client'

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Users, CreditCard, MessageSquare, Star, Car } from 'lucide-react';
import Navbar from '../components/navbar';

// Custom Alert Component
const Alert = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`p-4 rounded-lg border ${className}`}>
      {children}
    </div>
  );
  
  const AlertTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <h5 className={`font-medium mb-1 ${className}`}>{children}</h5>
  );
  
  const AlertDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <p className={className}>{children}</p>
  );
  

const RideDetailsPage = () => {
  const [seats, setSeats] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Sample ride data
  const ride = {
    id: 1,
    driver: {
      name: "Grass",
      rating: 4.8,
      trips: 142,
      vehicleInfo: "Toyota Camry (2022) - White",
      image: "/api/placeholder/64/64"
    },
    route: {
      from: "Downtown Station",
      to: "Airport Terminal 2",
      distance: "23.5 km",
      duration: "35 mins"
    },
    datetime: {
      date: "Feb 20, 2025",
      time: "09:00 AM"
    },
    price: 25,
    availableSeats: 3
  };

  const handleBooking = () => {
    setShowConfirmation(true);
  };

  return (
    <div>
    <Navbar/>
      <div className="max-w-2xl mx-auto p-6 pt-24">
      {showConfirmation && (
          <Alert className="mb-6 bg-indigo-50 border-indigo-200">
          <AlertTitle className="text-indigo-800">Booking Confirmed!</AlertTitle>
          <AlertDescription className="text-indigo-700">
            Your ride has been booked successfully. Check your email for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Route Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{ride.route.from}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{ride.route.to}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-medium">{ride.route.distance}</p>
            <p className="text-sm text-gray-500 mt-2">Duration</p>
            <p className="font-medium">{ride.route.duration}</p>
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>{ride.datetime.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{ride.datetime.time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={ride.driver.image} 
            alt={ride.driver.name}
            className="w-16 h-16 rounded-full"
            />
          <div>
            <h3 className="font-medium">{ride.driver.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{ride.driver.rating}</span>
              <span>•</span>
              <span>{ride.driver.trips} trips</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Car className="w-5 h-5" />
          <span>{ride.driver.vehicleInfo}</span>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Price per seat</p>
            <p className="text-2xl font-bold text-indigo-600">Rs.{ride.price}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Available seats</p>
            <p className="text-2xl font-bold">{ride.availableSeats}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of seats
          </label>
          <div className="flex items-center space-x-4">
            <button 
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              onClick={() => setSeats(Math.max(1, seats - 1))}
              >
              -
            </button>
            <span className="font-medium">{seats}</span>
            <button 
              className="w-8 h-8 rounded-full border flex items-center justify-center"
              onClick={() => setSeats(Math.min(ride.availableSeats, seats + 1))}
              >
              +
            </button>
          </div>
        </div>

        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span>Total price</span>
            <span className="font-bold">Rs.{ride.price * seats}</span>
          </div>
        </div>

        <button 
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          onClick={handleBooking}
          >
          Book Ride
        </button>

        <button className="w-full mt-3 text-indigo-600 py-2 rounded-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors">
          Message Driver
        </button>
      </div>
    </div>
    </div>
  );
};

export default RideDetailsPage;