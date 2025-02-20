"use client"
import React from 'react';
import Navbar from '../components/navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">About RideShare</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            RideShare was created to connect people traveling in the same direction, reducing traffic congestion,
            lowering transportation costs, and building community connections. We aim to make carpooling easy,
            safe, and affordable for everyone.
          </p>
          <p className="text-gray-700 mb-4">
            Founded in 2024, we're committed to sustainable transportation solutions that benefit both 
            individuals and our environment.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg">Post a ride</h3>
                <p className="text-gray-600">If you're driving, share your route and available seats with our community.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg">Find a ride</h3>
                <p className="text-gray-600">Looking for a lift? Search available rides in your area and choose what fits your schedule.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg">Confirm and pay</h3>
                <p className="text-gray-600">Book your seat, pay securely through our platform, and meet your driver at the designated spot.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-bold">JD</span>
              </div>
              <h3 className="font-medium">Johann's Cat</h3>
              <p className="text-gray-600 text-sm">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-bold">MP</span>
              </div>
              <h3 className="font-medium">Sanish Pagui</h3>
              <p className="text-gray-600 text-sm">Lead Developer</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                <span className="text-gray-500 text-xl font-bold">MP</span>
              </div>
              <h3 className="font-medium">Audumber Shirodhar</h3>
              <p className="text-gray-600 text-sm">Idle Developer</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2025 RideShare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;