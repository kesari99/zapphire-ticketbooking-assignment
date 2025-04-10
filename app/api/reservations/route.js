// app/api/reservations/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'user'; // Use .env in production

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    const { numberOfSeats } = await request.json();
    
    // Validate input
    if (!numberOfSeats) {
      return NextResponse.json(
        { message: 'Number of seats is required' },
        { status: 400 }
      );
    }
    
    if (numberOfSeats < 1 || numberOfSeats > 7) {
      return NextResponse.json(
        { message: 'You can only book 1 to 7 seats at a time' },
        { status: 400 }
      );
    }
    
    const availableSeats = await prisma.seat.findMany({
      where: { isBooked: false },
      orderBy: [
        { rowNumber: 'asc' },
        { seatNumber: 'asc' },
      ],
    });
    
    if (availableSeats.length < numberOfSeats) {
      return NextResponse.json(
        { message: `Not enough seats available. Only ${availableSeats.length} seats left.` },
        { status: 400 }
      );
    }
    
    const seatsByRow = availableSeats.reduce((acc, seat) => {
      if (!acc[seat.rowNumber]) {
        acc[seat.rowNumber] = [];
      }
      acc[seat.rowNumber].push(seat);
      return acc;
    }, {});
    
    let seatsToBook = [];
    
    for (const rowNumber in seatsByRow) {
      if (seatsByRow[rowNumber].length >= numberOfSeats) {
        seatsToBook = seatsByRow[rowNumber].slice(0, numberOfSeats);
        break;
      }
    }
    
    if (seatsToBook.length === 0) {
      const sortedRows = Object.keys(seatsByRow).sort(
        (a, b) => seatsByRow[b].length - seatsByRow[a].length
      );
      
      let remainingSeats = numberOfSeats;
      seatsToBook = [];
      
      for (const rowNumber of sortedRows) {
        const seatsFromRow = seatsByRow[rowNumber].slice(0, remainingSeats);
        seatsToBook = [...seatsToBook, ...seatsFromRow];
        remainingSeats -= seatsFromRow.length;
        
        if (remainingSeats <= 0) break;
      }
    }
    
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        numberOfSeats,
      },
    });
    
    await Promise.all(
      seatsToBook.map(seat =>
        prisma.seat.update({
          where: { id: seat.id },
          data: {
            isBooked: true,
            reservationId: reservation.id,
          },
        })
      )
    );
    
    return NextResponse.json({ 
      message: 'Seats booked successfully',
      reservation,
      bookedSeats: seatsToBook
    });
  } catch (error) {
    console.error('Error booking seats:', error);
    return NextResponse.json(
      { message: 'Failed to book seats' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    const reservations = await prisma.reservation.findMany({
      where: { userId },
      include: { seats: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { message: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}