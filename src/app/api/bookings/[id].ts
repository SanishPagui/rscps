// import { NextApiRequest, NextApiResponse } from 'next';
// import { prisma } from '../../lib/prisma';
// import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';
// import { z } from 'zod';

// const updateBookingSchema = z.object({
//   status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED'])
// });

// export default async function handler(
//   req: AuthenticatedRequest,
//   res: NextApiResponse
// ) {
//   const { id } = req.query;

//   if (req.method === 'PUT') {
//     try {
//       await authenticateToken(req, res, async () => {
//         const validatedData = updateBookingSchema.parse(req.body);

//         const booking = await prisma.booking.findUnique({
//           where: { id: String(id) },
//           include: { ride: true }
//         });

//         if (!booking) {
//           return res.status(404).json({ error: 'Booking not found' });
//         }

//         // Only allow driver to confirm/complete bookings
//         if (
//           (validatedData.status === 'CONFIRMED' || validatedData.status === 'COMPLETED') &&
//           booking.ride.driverId !== req.user!.id
//         ) {
//           return res.status(403).json({ error: 'Not authorized' });
//         }

//         // Only allow passenger to cancel their own booking
//         if (
//           validatedData.status === 'CANCELLED' &&
//           booking.passengerId !== req.user!.id
//         ) {
//           return res.status(403).json({ error: 'Not authorized' });
//         }

//         const updatedBooking = await prisma.booking.update({
//           where: { id: String(id) },
//           data: {
//             status: validatedData.status
//           },
//           include: {
//             ride: true,
//             passenger: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true
//               }
//             }
//           }
//         });

//         return res.status(200).json(updatedBooking);
//       });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return res.status(400).json({ error: error.errors });
//       }
//       return res.status(500).json({ error: 'Failed to update booking' });
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' });
// }