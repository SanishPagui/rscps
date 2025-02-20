'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = [
        { label: 'Details', href: '/details' },
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'About', href: '/about' },
    ];

    return (
        <nav className="fixed top-0 w-full z-[999] bg-white shadow-md">
            <div className="mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-600">
                            RideShare
                        </Link>
                    </div>

                    {/* Search Bar - Hidden on mobile */}
                    <div className="hidden md:flex items-center flex-1 max-w-md px-10">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for rides..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                            />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                className="text-gray-700 hover:text-indigo-600 text-[16px] lg:text-xl font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div 
                className={`md:hidden bg-white transition-all duration-300 ${
                    isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
                <div className="px-4 pt-2 pb-3">
                    {/* Mobile Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for rides..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                        />
                    </div>

                    {/* Mobile Menu Items */}
                    <div className="mt-2 space-y-1">
                        {navItems.map((item) => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
