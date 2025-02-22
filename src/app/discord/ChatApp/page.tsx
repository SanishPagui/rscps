'use client';

import { User } from 'stream-chat';
import { LoadingIndicator } from 'stream-chat-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import MyChat from '../../components/MyChat';
import LocomotiveScroll from 'locomotive-scroll';

const STREAM_API_KEY = 'ctpgdqf3h24c';

export type DiscordServer = {
    name: string;
    image: string | undefined;
  };

interface HomeState {
  apiKey: string;
  user: User;
  token: string;
}

interface StreamResponse {
  token: string;
}

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>(undefined);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  // Initialize LocomotiveScroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      const locomotiveScroll = new LocomotiveScroll();
      return () => locomotiveScroll.destroy();
    }
  }, []);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/Login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('user');
      router.push('/Login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const registerUser = useCallback(async () => {
    if (!user?.uid || !user?.email) {
      console.error('Missing user data for registration');
      return null;
    }

    try {
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      return null;
    }
  }, [user]);

  const getUserToken = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get token: ${response.statusText}`);
      }

      const { token }: StreamResponse = await response.json();

      if (!token) {
        throw new Error('Token not received from server');
      }

      const streamUser: User = {
        id: userId,
        name: userEmail.split('@')[0], // Using email username as display name
        image: `https://getstream.io/random_png/?id=${userId}&name=${userEmail}`,
      };

      setHomeState({
        apiKey: STREAM_API_KEY,
        user: streamUser,
        token,
      });
    } catch (error) {
      console.error('Error getting user token:', error);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (!user?.uid || !user?.email) return;

      // Check if user is registered with Stream
      // You might want to store this in Firebase user metadata or a separate database
      const isStreamRegistered = sessionStorage.getItem(`stream_registered_${user.uid}`);
      
      if (!isStreamRegistered) {
        console.log('Registering user on Stream backend');
        const result = await registerUser();
        if (result) {
          sessionStorage.setItem(`stream_registered_${user.uid}`, 'true');
          await getUserToken(user.uid, user.email);
        }
      } else {
        console.log('User already registered on Stream backend:', user.uid);
        await getUserToken(user.uid, user.email);
      }
    };

    if (user) {
      initializeUser();
    }
  }, [user, registerUser]);

  if (loading || !homeState) {
    return <LoadingIndicator />;
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
      <MyChat {...homeState} />
    </div>
  );
}