'use client'

import React from 'react'
import Home from './components/Home'
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';

const page = () => {
  useEffect(() => {
    if (typeof window !== "undefined") { 
        const locomotiveScroll = new LocomotiveScroll();
        return () => {
            locomotiveScroll.destroy();
        };
    }
}, []);
  return (
    <div>
      <Home/>
    </div>
  )
}

export default page