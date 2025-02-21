'use client'

import React from 'react'
import Home from './components/Home'
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const page = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = sessionStorage.getItem('user');

  if(!user && !userSession){
    router.push('/Login');
  }

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
      <button onClick={() => {
        signOut(auth)
        sessionStorage.removeItem('user');
      }}>Log Out</button>
      <Home/>
    </div>
  )
}

export default page