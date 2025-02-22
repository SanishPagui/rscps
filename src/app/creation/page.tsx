'use client'

import React, { useState } from 'react';
import { MapPin, Clock, Users, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Navbar from '../components/navbar';
import { useAuthToken } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

interface RideDetails {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
  price: string;
}

const CreateRidePage = () => {
  const router = useRouter()
  const { token, loading: authLoading } = useAuthToken();
  
  const [rideDetails, setRideDetails] = useState<RideDetails>({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please sign in to continue');
      router.push('/auth');
      return;
    }
    
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(rideDetails)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRideDetails({
      ...rideDetails,
      [e.target.name]: e.target.value
    });
  };

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-hover:text-indigo-500" />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <Card className="shadow-xl rounded-2xl border-0 bg-gray-50 backdrop-blur-lg backdrop-filter">
          <CardHeader className="space-y-3 pb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">Create a New Ride</CardTitle>
            <p className="text-center text-gray-600">Share your journey and help others reach their destination</p>
          </CardHeader>
          <CardContent className="px-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-sm">
                <p className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl shadow-sm">
                <p className="flex items-center">
                  <span className="mr-2">✅</span>
                  Ride created successfully!
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center px-3">
                    <div className="h-full w-0.5 bg-indigo-200"></div>
                  </div>
                  <InputField
                    icon={MapPin}
                    type="text"
                    name="from"
                    value={rideDetails.from}
                    onChange={handleChange}
                    placeholder="Pickup Location"
                    required
                  />
                </div>
                <InputField
                  icon={MapPin}
                  type="text"
                  name="to"
                  value={rideDetails.to}
                  onChange={handleChange}
                  placeholder="Drop-off Location"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={Calendar}
                  type="date"
                  name="date"
                  value={rideDetails.date}
                  onChange={handleChange}
                  required
                />
                <InputField
                  icon={Clock}
                  type="time"
                  name="time"
                  value={rideDetails.time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  icon={Users}
                  type="number"
                  name="seats"
                  value={rideDetails.seats}
                  onChange={handleChange}
                  placeholder="Available Seats"
                  min="1"
                  required
                />
                <InputField
                  icon={DollarSign}
                  type="number"
                  name="price"
                  value={rideDetails.price}
                  onChange={handleChange}
                  placeholder="Price per Seat"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Ride'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRidePage;