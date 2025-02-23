'use client';

import { User } from 'stream-chat';
import { LoadingIndicator } from 'stream-chat-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import MyChat from '../components/MyChat/MyChat';
import LocomotiveScroll from 'locomotive-scroll';

// Move to environment variables
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || 'ctpgdqf3h24c';

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
  error?: string;
}

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>(undefined);
  const [initError, setInitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading, authError] = useAuthState(auth);
  const router = useRouter();

  // Initialize LocomotiveScroll
  useEffect(() => {
    let locomotiveScroll: any;
    
    if (typeof window !== "undefined") {
      try {
        locomotiveScroll = new LocomotiveScroll();
      } catch (error) {
        console.error('Failed to initialize LocomotiveScroll:', error);
      }
    }
    
    return () => {
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
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
      sessionStorage.clear(); // Clear all session storage
      router.push('/Login');
    } catch (error) {
      console.error("Logout error:", error);
      setInitError("Failed to log out. Please try again.");
    }
  };

  const registerUser = useCallback(async () => {
    if (!user?.uid || !user?.email) {
      setInitError('Missing user data for registration');
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Registration failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register user';
      setInitError(errorMessage);
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Failed to get token: ${response.statusText}`);
      }

      const { token, error }: StreamResponse = await response.json();

      if (error || !token) {
        throw new Error(error || 'Token not received from server');
      }

      const streamUser: User = {
        id: userId,
        name: userEmail.split('@')[0],
        image: `https://getstream.io/random_png/?id=${userId}&name=${userEmail}`,
      };

      setHomeState({
        apiKey: STREAM_API_KEY,
        user: streamUser,
        token,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get user token';
      setInitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (!user?.uid || !user?.email) return;

      try {
        setIsLoading(true);
        setInitError(null);
        
        const streamRegisteredKey = `stream_registered_${user.uid}`;
        const isStreamRegistered = sessionStorage.getItem(streamRegisteredKey);
        
        if (!isStreamRegistered) {
          console.log('Registering user on Stream backend');
          const result = await registerUser();
          if (result) {
            sessionStorage.setItem(streamRegisteredKey, 'true');
            await getUserToken(user.uid, user.email);
          }
        } else {
          console.log('User already registered on Stream backend:', user.uid);
          await getUserToken(user.uid, user.email);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize user';
        setInitError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      initializeUser();
    }
  }, [user, registerUser]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  // Show error state
  if (authError || initError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">
          {authError?.message || initError}
        </div>
        <button 
          onClick={() => router.push('/Login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Login
        </button>
      </div>
    );
  }

  // Handle not authenticated state
  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 flex justify-end">
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Log Out
        </button>
      </div>
      {homeState && <MyChat {...homeState} />}
    </div>
  );
}