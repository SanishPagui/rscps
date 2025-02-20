import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';
import { z } from 'zod';

const createBookingSchema = z.object({
  rideId: z.string(),
  seats: z.number().min(1)
});

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await authenticateToken(req, res, async () => {
        const validatedData = createBookingSchema.parse(req.body);

        const ride = await prisma.ride.findUnique({
          where: { id: validatedData.rideId },
          include: { bookings: true }
        });

        if (!ride) {
          return res.status(404).json({ error: 'Ride not found' });
        }

        // Check if ride is available
        if (!ride.available) {
          return res.status(400).json({ error: 'Ride is not available' });
        }

        // Calculate available seats
        const bookedSeats = ride.bookings.reduce((acc, booking) => 
          booking.status !== 'CANCELLED' ? acc + booking.seats : acc, 0
        );
        const availableSeats = ride.seats - bookedSeats;

        if (validatedData.seats > availableSeats) {
          return res.status(400).json({ error: 'Not enough seats available' });
        }

        const booking = await prisma.booking.create({
          data: {
            rideId: validatedData.rideId,
            passengerId: req.user!.id,
            seats: validatedData.seats
          },
          include: {
            ride: true,
            passenger: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        });

        return res.status(201).json(booking);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  }

  if (req.method === 'GET') {
    try {
      await authenticateToken(req, res, async () => {
        const bookings = await prisma.booking.findMany({
          where: {
            passengerId: req.user!.id
          },
          include: {
            ride: {
              include: {
                driver: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return res.status(200).json(bookings);
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}