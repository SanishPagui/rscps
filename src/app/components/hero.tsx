import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Car, Calendar, Users, MapPin } from 'lucide-react';

const Hero = () => {
  // Sample ride data
  const rides = [
    {
      id: 1,
      from: "Downtown",
      to: "Airport",
      date: "Today, 2:00 PM",
      price: "Rs.300",
      seats: 3,
      icon: Car
    },
    {
      id: 2,
      from: "University",
      to: "Shopping Mall",
      date: "Today, 3:30 PM",
      price: "Rs.300",
      seats: 2,
      icon: Car
    },
    {
      id: 3,
      from: "Beach",
      to: "City Center",
      date: "Today, 4:00 PM",
      price: "Rs.300",
      seats: 4,
      icon: Car
    },
    {
      id: 4,
      from: "Suburbs",
      to: "Concert Hall",
      date: "Today, 5:30 PM",
      price: "Rs.300",
      seats: 3,
      icon: Car
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    return () => {};
  }, []);

  return (
    <div className=" bg-gray-50 pt-24 pb-8">
      {/* Hero Text */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find Your Perfect Ride
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse through available rides and find the perfect match for your journey
        </p>
      </div>

      {/* Scrollable Cards Container */}
      <div className="relative w-full overflow-x-auto">
        <div 
          className="cards-container flex gap-6 px-4 md:px-8 pb-4 overflow-x-auto snap-x snap-mandatory"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {rides.map((ride, index) => (
            <div
              key={ride.id}
              className="flex-shrink-0 w-80 bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 snap-center"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <ride.icon className="h-6 w-6" />
                  <span className="font-semibold">{ride.price}</span>
                </div>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                  {ride.seats} seats left
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{ride.from}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{ride.to}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <p className="text-gray-600">{ride.date}</p>
                </div>
              </div>

              <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                Book Ride
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;