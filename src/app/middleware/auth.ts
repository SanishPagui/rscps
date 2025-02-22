import { NextRequest, NextResponse } from "next/server";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase-admin/auth";
import { prisma } from "@/lib/prisma";
import admin from "../firebase/admin"; // Ensure Firebase Admin is initialized

export async function authenticateToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    // Verify Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    if (!decodedToken) return null;

    // Find user in Prisma database using Firebase UID
    let user = await prisma.user.findUnique({
      where: { id: decodedToken.uid }, // Use id instead of firebaseUid
      select: { id: true, email: true }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: decodedToken.uid,  // Store Firebase UID as the primary ID
          email: decodedToken.email!,
          password: "", // Add a placeholder password
        },
        select: { id: true, email: true }
      });
    }
    
    

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}



export async function signUp(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Sign up with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth , email, password);
    const user = userCredential.user;

    return { success: true, uid: user.uid, email: user.email };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return { error: error.message };
  }
}

export async function logIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Log in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { success: true, uid: user.uid, email: user.email };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.message };
  }
}
