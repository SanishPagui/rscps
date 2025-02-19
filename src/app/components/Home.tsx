'use client'

import React, { useState } from 'react';
import Hero from './hero';
import Footer from './footer';
import Navbar from './navbar';

const Home = () => {

  return (
    <div className="w-full bg-gray-50">   
        <Navbar/>
        <Hero/>
        <Footer/>
    </div>
  );
};

export default Home;