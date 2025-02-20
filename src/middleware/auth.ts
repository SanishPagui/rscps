// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

interface AuthState {
  error?: string;
  success?: boolean;
}

export async function signUp(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password || !name) {
      return { error: 'All fields are required' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' }
    }

    // Here you would typically:
    // 1. Hash the password
    // 2. Check if user exists
    // 3. Create user in database
    // 4. Create session
    
    // This is a placeholder - replace with your actual authentication logic
    console.log('Signing up:', { name, email, password })
    
    return { success: true }
  } catch (error) {
    console.error('Sign up error:', error)
    return { error: 'Failed to create account' }
  }
}

export async function logIn(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate inputs
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    // Here you would typically:
    // 1. Verify credentials
    // 2. Create session
    
    // This is a placeholder - replace with your actual authentication logic
    console.log('Logging in:', { email, password })
    
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Invalid credentials' }
  }
}
