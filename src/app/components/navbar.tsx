'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className=" mx-auto lg:mx-20 px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600">
                RideShare
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for rides..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm md:text-[16px] lg:text-xl font-medium"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm md:text-[16px] lg:text-xl font-medium"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm md:text-[16px] lg:text-xl font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Hamburger Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            {/* Mobile Search Bar */}
            <div className="px-4 pt-2 pb-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for rides..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default navbar