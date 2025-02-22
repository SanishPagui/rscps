import { NextRequest } from "next/server";
import admin from "firebase-admin";
import { prisma } from "@/lib/prisma";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// ✅ Ensure Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix \n escape issues
    }),
  });
}

export const adminAuth = admin.auth();

// ✅ Initialize Firebase Client SDK (Frontend)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ Authenticate Token Middleware
export async function authenticateToken(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken) return null;

    console.log("Auth Token Verified:", decodedToken);

    // Find user in Prisma or create if not exists
    let user = await prisma.user.findUnique({
      where: { id: decodedToken.uid }, // Ensure UID is stored properly
      select: { id: true, email: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: decodedToken.uid, // Store Firebase UID as the primary key
          email: decodedToken.email!,
          password: "", // Placeholder password (unused)
        },
        select: { id: true, email: true },
      });
    }

    return user;
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}

// ✅ Sign Up Function
export async function signUp(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return { error: "All fields are required" };
    if (password.length < 6) return { error: "Password must be at least 6 characters" };

    // Sign up with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { success: true, uid: user.uid, email: user.email };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return { error: error.message };
  }
}

// ✅ Login Function
export async function logIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { error: "Email and password are required" };

    // Log in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return { success: true, uid: user.uid, email: user.email };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.message };
  }
}
