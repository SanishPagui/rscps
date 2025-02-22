import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticateToken } from "@/app/middleware/auth";

// Handle GET request
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");

    // Build where clause based on search parameters
    const whereClause: any = {
      available: true,
      date: { gte: new Date() }
    };

    if (from) whereClause.from = { contains: from, mode: "insensitive" };
    if (to) whereClause.to = { contains: to, mode: "insensitive" };
    if (date)
      whereClause.date = {
        gte: new Date(date),
        lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };

    const rides = await prisma.ride.findMany({
      where: whereClause,
      include: {
        driver: { select: { name: true, email: true } },
        bookings: {
          where: { status: { not: "CANCELLED" } },
          select: { seats: true }
        }
      },
      orderBy: { date: "asc" }
    });

    // Calculate available seats
    const ridesWithAvailableSeats = rides.map((ride) => ({
      ...ride,
      availableSeats: ride.seats - ride.bookings.reduce((acc, b) => acc + b.seats, 0),
      bookings: undefined // Remove bookings from response
    }));

    return NextResponse.json(ridesWithAvailableSeats, { status: 200 });
  } catch (error) {
    console.error("Fetch rides error:", error);
    return NextResponse.json({ error: "Failed to fetch rides" }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateToken(req);
    console.log("Request Headers:", user);

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { from, to, date, time, seats, price } = await req.json();
    if (!from || !to || !date || !time || !seats || !price) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const ride = await prisma.ride.create({
      data: { from, to, date: new Date(date), time, seats: parseInt(seats), price: parseFloat(price), driverId: user.id }
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Create ride error:", error);
    return NextResponse.json({ error: "Failed to create ride" }, { status: 500 });
  }
}
