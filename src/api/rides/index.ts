
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await authenticateToken(req, res, async () => {
        const { from, to, date, time, seats, price } = req.body;

        // Validate input
        if (!from || !to || !date || !time || !seats || !price) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new ride
        const ride = await prisma.ride.create({
          data: {
            from,
            to,
            date: new Date(date),
            time,
            seats: parseInt(seats),
            price: parseFloat(price),
            driverId: req.user!.id
          }
        });

        return res.status(201).json(ride);
      });
    } catch (error) {
      console.error('Create ride error:', error);
      return res.status(500).json({ error: 'Failed to create ride' });
    }
  } else if (req.method === 'GET') {
    try {
      const rides = await prisma.ride.findMany({
        where: {
          available: true,
          date: {
            gte: new Date()
          }
        },
        include: {
          driver: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      return res.status(200).json(rides);
    } catch (error) {
      console.error('Fetch rides error:', error);
      return res.status(500).json({ error: 'Failed to fetch rides' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}