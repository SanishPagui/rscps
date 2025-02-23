import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'STREAM_API_KEY',
  'STREAM_SECRET'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase');
  }
}

export async function POST(request: Request) {
  try {
    const serverClient = StreamChat.getInstance(
      process.env.STREAM_API_KEY!,
      process.env.STREAM_SECRET!
    );

    const body = await request.json();
    console.log('[/api/register-user] Body:', body);

    const { userId, email } = body;

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: userId or email' }), 
        { status: 400 }
      );
    }

    // Create Stream Chat user
    try {
      const user = await serverClient.upsertUser({
        id: userId,
        role: 'user',
        name: email,
        imageUrl: `https://getstream.io/random_png/?id=${userId}&name=${email}`,
      });
    } catch (error) {
      console.error('[/api/register-user] Stream error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create Stream user' }), 
        { status: 500 }
      );
    }

    // Update Firebase user custom claims
    try {
      await auth().setCustomUserClaims(userId, {
        streamRegistered: true
      });

      const updatedUser = await auth().getUser(userId);
      console.log('[/api/register-user] User:', updatedUser);
    } catch (error) {
      console.error('[/api/register-user] Firebase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update Firebase user' }), 
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        userId,
        userName: email,
      }), 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('[/api/register-user] General error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500 }
    );
  }
}