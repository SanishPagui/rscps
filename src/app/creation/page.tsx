'use client'

import React, { useState } from 'react';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Navbar from '../components/navbar';

interface RideDetails {
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string;
  price: string;
}

const CreateRidePage = () => {
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(rideDetails)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ride');
      }

      setSuccess(true);
      setRideDetails({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: '',
        price: ''
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

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 pt-24">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Ride</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                Ride created successfully!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="from"
                  value={rideDetails.from}
                  onChange={handleChange}
                  placeholder="Pickup Location"
                  className="pl-10 w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="to"
                  value={rideDetails.to}
                  onChange={handleChange}
                  placeholder="Drop-off Location"
                  className="pl-10 w-full p-2 border rounded"
                  required
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="date" 
                    name="date"
                    value={rideDetails.date}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="time" 
                    name="time"
                    value={rideDetails.time}
                    onChange={handleChange}
                    className="pl-10 w-full p-2 border rounded"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="seats"
                    value={rideDetails.seats}
                    onChange={handleChange}
                    placeholder="Available Seats"
                    className="pl-10 w-full p-2 border rounded"
                    required
                    min="1"
                    disabled={loading}
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={rideDetails.price}
                    onChange={handleChange}
                    placeholder="Price per Seat"
                    className="pl-10 w-full p-2 border rounded"
                    required
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white p-3 rounded font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Ride'}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRidePage;