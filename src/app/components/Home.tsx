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
        <Spline scene="https://prod.spline.design/vqc4xqBFKX068Pxs/scene.splinecode" />
        <div className="absolute top-20 left-10 right-10 flex flex-col md:flex-row justify-between p-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white p-8 h-96 w-80
                          md:mt-28 md:ml-12 md:h-80 md:w-64 md:p-8
                          sm:mt-4 sm:h-72 sm:w-56 sm:p-4 sm:mx-0">
            <h2 className="text-5xl font-bold text-white 
                           md:text-4xl sm:text-3xl">Create A Journey!</h2>
            <p className="text-white">idk man i just typing</p>
            <div className="mt-4 py-4 px-24 bg-white/10 backdrop-blur-lg rounded-xl border-2 border-white
                            md:px-20 sm:px-16">
              <Link href="/creation" className="text-white justify-center items-center"> 
                Click Me
              </Link>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border-2 border-white p-8 h-96 w-80 mt-4
                          md:mt-28 md:mr-12 md:h-80 md:w-64 md:p-8
                          sm:mt-4 sm:h-72 sm:w-56 sm:p-4 sm:mx-0">
            <h2 className="text-5xl font-bold text-white 
                           md:text-4xl sm:text-3xl">Join A Journey!</h2>
            <p className="text-white">idk man i just typing</p>
            <div className="mt-4 py-4 px-24 bg-white/10 backdrop-blur-lg rounded-xl border-2 border-white
                            md:px-20 sm:px-16">
              <Link href="/creation" className="text-white">
                Click Me
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
