import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ride = await prisma.ride.findUnique({
        where: { id: String(id) },
        include: {
          driver: {
            select: {
              name: true,
              email: true
            }
          },
          bookings: true
        }
      });

      if (!ride) {
        return res.status(404).json({ error: 'Ride not found' });
      }

      return res.status(200).json(ride);
    } catch (error) {
      console.error('Fetch ride error:', error);
      return res.status(500).json({ error: 'Failed to fetch ride' });
    }
  }

  if (req.method === 'PUT') {
    try {
      await authenticateToken(req, res, async () => {
        const ride = await prisma.ride.findUnique({
          where: { id: String(id) }
        });

        if (!ride) {
          return res.status(404).json({ error: 'Ride not found' });
        }

        if (ride.driverId !== req.user!.id) {
          return res.status(403).json({ error: 'Not authorized' });
        }

        const updatedRide = await prisma.ride.update({
          where: { id: String(id) },
          data: req.body
        });

        return res.status(200).json(updatedRide);
      });
    } catch (error) {
      console.error('Update ride error:', error);
      return res.status(500).json({ error: 'Failed to update ride' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}