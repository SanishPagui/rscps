// lib/authListener.ts
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export function initAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get the token and store it
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      
      // Set up token refresh
      let tokenRefreshTimeout: NodeJS.Timeout;
      
      const refreshToken = async () => {
        try {
          const newToken = await user.getIdToken(true);
          localStorage.setItem('token', newToken);
          // Tokens typically expire in 1 hour, refresh every 55 minutes
          tokenRefreshTimeout = setTimeout(refreshToken, 55 * 60 * 1000);
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      };

      // Initial token refresh setup
      tokenRefreshTimeout = setTimeout(refreshToken, 55 * 60 * 1000);

      return () => {
        if (tokenRefreshTimeout) {
          clearTimeout(tokenRefreshTimeout);
        }
      };
    } else {
      // User is signed out
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
  });
}