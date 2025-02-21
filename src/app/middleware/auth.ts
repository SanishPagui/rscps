import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface AuthenticatedUser {
  id: string;
  email: string;
}

export async function authenticateToken(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return null; // No token provided
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthenticatedUser;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true }
    });

    return user || null; // Return user if found, otherwise null
  } catch (error) {
    console.error("Auth error:", error);
    return null; // Invalid token
  }
}

interface AuthState {
  error?: string;
  success?: boolean;
}

export async function signUp(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Hash the password (implement hashing before storing in DB)
    // Check if user exists
    // Create user in database
    // Generate JWT token if needed

    console.log("Signing up:", { name, email, password });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { error: "Failed to create account" };
  }
}

export async function logIn(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Verify user credentials
    // Generate JWT token and return it

    console.log("Logging in:", { email, password });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Invalid credentials" };
  }
}
