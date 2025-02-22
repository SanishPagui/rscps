'use client'

import React, { useEffect } from 'react'
import Home from './components/Home'
import LocomotiveScroll from 'locomotive-scroll';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const Page = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/Login');
      return;
    }

    // If user exists, get and store their token
    if (user) {
      const setToken = async () => {
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
      };
      setToken();
    }
    
    // Initialize LocomotiveScroll
    if (typeof window !== "undefined") { 
      const locomotiveScroll = new LocomotiveScroll();
      return () => locomotiveScroll.destroy();
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear both session storage and token
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/Login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
      <Home/>
    </div>
  )
}

export default Page