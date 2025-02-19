'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* Logo & Description */}
          <div>
            <h2 className="text-xl font-bold text-white">RideShare</h2>
            <p className="mt-2 text-sm">
              Your trusted platform for safe and affordable ride-sharing.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link href="/" className="hover:text-indigo-400">Home</Link></li>
              <li><Link href="/about" className="hover:text-indigo-400">About</Link></li>
              <li><Link href="/rides" className="hover:text-indigo-400">Find a Ride</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-400">Contact</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <p className="mt-2 text-sm">conradidkwho@gmail.com</p>
            <p className="text-sm">+91 1234567890</p>

            {/* Social Media Icons */}
            <div className="flex justify-center md:justify-start mt-4 space-x-4">
              <Link href="https://facebook.com" target="_blank">
                <Facebook className="w-5 h-5 hover:text-blue-500" />
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <Twitter className="w-5 h-5 hover:text-blue-400" />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Instagram className="w-5 h-5 hover:text-pink-500" />
              </Link>
              <Link href="mailto:support@rideshare.com">
                <Mail className="w-5 h-5 hover:text-green-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} RideShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
