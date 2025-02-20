'use client';

import React from 'react';
import Footer from './footer';
import Navbar from './navbar';
import Spline from '@splinetool/react-spline';
import Link from 'next/link';

const Home = () => {

  return (
    <div className="w-full bg-gray-50 relative">
      <Navbar />
      <main className="relative h-screen">
        <Spline
          className="z-[990]"
          scene="https://prod.spline.design/vqc4xqBFKX068Pxs/scene.splinecode"
          style={{ 
            width: '100%', 
            height: '100%',
            pointerEvents: 'auto'
          }}
        />
        <div className="absolute -top-72 md::-top-96 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 px-4 md:px-0">
            <Link href="/creation" className="text-white pointer-events-auto"> 
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white p-8
                            w-full md:w-64 md:h-72 
                            hover:bg-white/20 transition-all duration-300
                            flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                  Create A Journey!
                </h2>
              </div>
            </Link>
            
            <Link href="/booking" className="text-white pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white p-8
                            w-full md:w-64 md:h-72
                            hover:bg-white/20 transition-all duration-300
                            flex items-center justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                  Join A Journey!
                </h2>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;