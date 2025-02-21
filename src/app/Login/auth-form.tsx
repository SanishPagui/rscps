"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { auth } from "@/app/firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from "firebase/auth";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
      sessionStorage.setItem('user', 'true');
      router.push('/');
    } catch (error: any) {
      console.error("Sign-up Error: ", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("This email is already in use. Please use a different email or log in.");
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network request failed. Please check your internet connection.");
      } else {
        setError(error.message || "Error during sign-up");
      }
    }
  };

  const handleLogIn = async () => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
      sessionStorage.setItem('user', 'true');
      router.push('/');
    } catch (error: any) {
      console.error("Log-in Error: ", error);
      if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email. Please sign up.");
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network request failed. Please check your internet connection.");
      } else {
        setError(error.message || "Error during log-in");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      sessionStorage.setItem('user', 'true');
      router.push('/');
    } catch (error: any) {
      console.error("Google Sign-in Error: ", error);
      if (error.code === 'auth/network-request-failed') {
        setError("Network request failed. Please check your internet connection.");
      } else {
        setError(error.message || "Error signing in with Google");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogIn();
    } else {
      await handleSignUp();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              className="hover:border-red-200 focus:border-purple-400"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            className="hover:border-red-200 focus:border-purple-400"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            className="hover:border-red-200 focus:border-purple-400"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-gray-900 text-white">
          {isLogin ? "Log In" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-amber-600 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>

      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleGoogleSignIn}
          type="button"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
      </div>

      {error && (
        <p className="mt-4 text-red-600 text-center text-sm">{error}</p>
      )}
    </motion.div>
  );
}
