"use client"
//for comit
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, MapPin, Award, Clock, Star, Settings } from 'lucide-react';
import Navbar from '../components/navbar';

const UserDashboard = () => {
  const activityData = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.8 },
    { name: 'Wed', hours: 2.1 },
    { name: 'Thu', hours: 4.2 },
    { name: 'Fri', hours: 3.5 },
    { name: 'Sat', hours: 5.0 },
    { name: 'Sun', hours: 3.2 },
  ];

  const achievements = [
    { id: 1, title: "100 Days Streak", progress: 85, icon: <Star className="h-5 w-5 text-yellow-500" /> },
    { id: 2, title: "Master Explorer", progress: 60, icon: <MapPin className="h-5 w-5 text-blue-500" /> },
    { id: 3, title: "Time Champion", progress: 40, icon: <Clock className="h-5 w-5 text-green-500" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      {/* Header Section */}
      <div className="mt-16 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">^^</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white dark:text-white">Welcome back!</h1>
                <p className="text-gray-500 dark:text-gray-400">Member since 2025</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="transform hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white dark:text-white">24</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Days</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white dark:text-white">1,234</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Points Earned</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Award className="h-8 w-8 text-green-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Achievements</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white dark:text-white">12</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unlocked</p>
              </div>
            </CardContent>
          </Card>

          <Card className="transform hover:scale-105 transition-transform duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-purple-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Average</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-white dark:text-white">3.4h</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Activity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50 " />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-white font-semibold">Current Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {achievement.icon}
                        <span className="font-medium text-white">{achievement.title}</span>
                      </div>
                      <span className="text-sm  text-gray-500">{achievement.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;