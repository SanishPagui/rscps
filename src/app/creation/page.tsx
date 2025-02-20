"use client"
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      // Reset form and show success message
      setRideDetails({
        from: '',
        to: '',
        date: '',
        time: '',
        seats: '',
        price: ''
      });
      alert('Ride created successfully!');
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Create a Ride</h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="from"
              value={rideDetails.from}
              onChange={handleChange}
              placeholder="Pickup Location"
              className="w-full p-2 border rounded"
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="to"
              value={rideDetails.to}
              onChange={handleChange}
              placeholder="Drop-off Location"
              className="w-full p-2 border rounded"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="date" 
              name="date"
              value={rideDetails.date}
              onChange={handleChange}
              className="p-2 border rounded"
              required
              disabled={loading}
            />
            <input 
              type="time" 
              name="time"
              value={rideDetails.time}
              onChange={handleChange}
              className="p-2 border rounded"
              required
              disabled={loading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="seats"
              value={rideDetails.seats}
              onChange={handleChange}
              placeholder="Available Seats"
              className="p-2 border rounded"
              required
              min="1"
              disabled={loading}
            />
            <input
              type="number"
              name="price"
              value={rideDetails.price}
              onChange={handleChange}
              placeholder="Price per Seat"
              className="p-2 border rounded"
              required
              min="0"
              disabled={loading}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRidePage;