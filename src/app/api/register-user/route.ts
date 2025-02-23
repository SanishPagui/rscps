import { StreamChat } from 'stream-chat';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { NextRequest, NextResponse } from 'next/server';

// Define request body type
interface RegisterUserRequest {
  userId: string;
  email: string;
}

// Define response types
interface SuccessResponse {
  userId: string;
  userName: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'STREAM_API_KEY',
  'STREAM_SECRET'
] as const;

// Validate environment variables are present
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Debug log for private key format
console.log('Private key starts with:', process.env.FIREBASE_PRIVATE_KEY?.substring(0, 27));

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
    console.log('Initializing Firebase with project:', process.env.FIREBASE_PROJECT_ID);
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase initialized successfully');
  } catch (error) {
    const err = error as Error;
    console.error('Firebase initialization error:', {
      message: err.message,
      stack: err.stack
    });
    throw new Error(`Failed to initialize Firebase: ${err.message}`);
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    console.log('[/api/register-user] Starting registration process');
    
    // Initialize Stream Chat client
    const serverClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_SECRET!
    );
    console.log('[/api/register-user] Stream client initialized');

    // Parse request body
    const body = await request.json() as RegisterUserRequest;
    console.log('[/api/register-user] Request body:', body);

    const { userId, email } = body;

    // Validate required fields
    if (!userId || !email) {
      console.log('[/api/register-user] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: userId or email' },
        { status: 400 }
      );
    }

    // Create Stream Chat user
    try {
      await serverClient.upsertUser({
        id: userId,
        role: 'user',
        name: email,
        imageUrl: `https://getstream.io/random_png/?id=${userId}&name=${email}`,
      });
      console.log('[/api/register-user] Stream user created successfully');
    } catch (error) {
      const err = error as Error;
      console.error('[/api/register-user] Stream error:', {
        message: err.message,
        details: err instanceof Error ? err.stack : undefined
      });
      return NextResponse.json(
        { 
          error: 'Failed to create Stream user',
          details: err.message 
        },
        { status: 500 }
      );
    }

    // Update Firebase user
    try {
      // Verify user exists in Firebase
      const userRecord = await auth().getUser(userId);
      console.log('[/api/register-user] Firebase user found:', userRecord.uid);

      // Set custom claims
      await auth().setCustomUserClaims(userId, {
        streamRegistered: true
      });
      console.log('[/api/register-user] Custom claims set successfully');

    } catch (error) {
      const err = error as Error;
      console.error('[/api/register-user] Firebase error:', {
        message: err.message,
        stack: err.stack
      });
      return NextResponse.json(
        { 
          error: 'Failed to update Firebase user',
          details: err.message 
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      userId,
      userName: email,
    });

  } catch (error) {
    const err = error as Error;
    console.error('[/api/register-user] General error:', {
      message: err.message,
      stack: err.stack
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err.message 
      },
      { status: 500 }
    );
  }
}