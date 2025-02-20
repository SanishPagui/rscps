"use client"
import React from 'react';
import Navbar from '../components/navbar';
import { ArrowRight, MapPin, Car, Shield, CreditCard, Star } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-24 pb-12 md:pt-32 md:pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Share Rides, <span className="text-indigo-600">Save Money</span>, Make Friends
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with travelers going your way and share the journey. Affordable, eco-friendly, and social.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/creation" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center">
              Create a Ride <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/search" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-md font-medium hover:bg-gray-50 flex items-center justify-center">
              Find a Ride
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Airport', rides: 24, savings: '₹350' },
              { name: 'Margao', rides: 42, savings: '₹250' },
              { name: 'Panjim', rides: 38, savings: '₹300' },
            ].map((destination) => (
              <div key={destination.name} className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl">{destination.name}</h3>
                    <p className="text-gray-600">{destination.rides} rides available</p>
                  </div>
                </div>
                <p className="text-indigo-600 font-medium">Average savings: {destination.savings}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How RideShare Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Set your destination</h3>
              <p className="text-gray-600">Enter where you're going and when to find potential ride matches.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Choose your ride</h3>
              <p className="text-gray-600">Browse available rides, check driver profiles, and select your best match.</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Book securely</h3>
              <p className="text-gray-600">Pay through our secure platform and meet your driver at the pickup location.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-12 px-4 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose RideShare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Shield className="h-8 w-8 text-indigo-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Safe and Secure</h3>
                  <p className="text-gray-600">All drivers are verified and rated by our community. Our platform ensures secure payments and communication.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CreditCard className="h-8 w-8 text-indigo-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                  <p className="text-gray-600">Share the cost of your journey and save up to 60% compared to traditional transportation options.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Star className="h-8 w-8 text-indigo-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Rated Community</h3>
                  <p className="text-gray-600">Our rating system ensures quality experiences. Choose drivers with great reviews for peace of mind.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <Car className="h-8 w-8 text-indigo-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reduce Traffic</h3>
                  <p className="text-gray-600">By sharing rides, you're helping reduce the number of vehicles on the road, easing congestion and pollution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of satisfied users who are already saving money and making connections.</p>
          <Link href="/creation" className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 inline-flex items-center">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">RideShare</h3>
            <div className="flex justify-center space-x-6 mb-6">
              {['About', 'Contact', 'Terms', 'Privacy'].map((link) => (
                <Link href={`/${link.toLowerCase()}`} key={link} className="hover:text-indigo-300">
                  {link}
                </Link>
              ))}
            </div>
            <p className="text-gray-400">© 2025 RideShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;