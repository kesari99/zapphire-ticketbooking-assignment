export const dynamic = 'force-dynamic'; 
export const runtime = 'nodejs'; 
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'user'; 

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
    
    // Group seats by row
    const seatsByRow = availableSeats.reduce((acc, seat) => {
      if (!acc[seat.rowNumber]) {
        acc[seat.rowNumber] = [];
      }
      acc[seat.rowNumber].push(seat);
      return acc;
    }, {});

    
    // Get all row numbers sorted
    const allRows = Object.keys(seatsByRow).map(Number).sort((a, b) => a - b);
    
    let seatsToBook = [];
    
    // Try to find seats in a single row first
    for (const rowNumber of allRows) {
      if (seatsByRow[rowNumber].length >= numberOfSeats) {
        seatsToBook = seatsByRow[rowNumber].slice(0, numberOfSeats);
        break;
      }
    }
    
    // If we couldn't find enough seats in a single row,
    // try to find adjacent rows with enough seats
    if (seatsToBook.length === 0) {
      
      let bestStartingRow = null;
      let bestTotalSeats = 0;
      
      for (let i = 0; i < allRows.length; i++) {
        let totalSeats = 0;
        let consecutiveRows = 0;
        
        // Check how many consecutive rows we need
        for (let j = i; j < allRows.length; j++) {
          const currentRow = allRows[j];
          const nextRowExpected = j === i ? currentRow : allRows[j-1] + 1;
          
          // If rows are not consecutive, break
          if (currentRow !== nextRowExpected && j > i) {
            break;
          }
          
          totalSeats += seatsByRow[currentRow].length;
          consecutiveRows++;
          
          if (totalSeats >= numberOfSeats) {
            if (bestStartingRow === null || consecutiveRows < bestTotalSeats) {
              bestStartingRow = i;
              bestTotalSeats = consecutiveRows;
            }
            break;
          }
        }
      }
      
      if (bestStartingRow !== null) {
        let remainingSeats = numberOfSeats;
        let rowIndex = bestStartingRow;
        
        // Book seats from adjacent rows
        while (remainingSeats > 0 && rowIndex < allRows.length) {
          const currentRow = allRows[rowIndex];
          const nextRowExpected = rowIndex === bestStartingRow ? currentRow : allRows[rowIndex-1] + 1;
          
          // If rows are not consecutive, break
          if (currentRow !== nextRowExpected && rowIndex > bestStartingRow) {
            break;
          }
          
          const seatsFromRow = seatsByRow[currentRow].slice(0, remainingSeats);
          seatsToBook = [...seatsToBook, ...seatsFromRow];
          remainingSeats -= seatsFromRow.length;
          rowIndex++;
        }
      }
      
      // If we still couldn't find adjacent rows with enough seats,
      // fall back to booking any available seats starting from rows with the most seats
      if (seatsToBook.length === 0) {
        const sortedRows = Object.keys(seatsByRow).sort(
          (a, b) => seatsByRow[b].length - seatsByRow[a].length
        );
        
        let remainingSeats = numberOfSeats;
        
        for (const rowNumber of sortedRows) {
          const seatsFromRow = seatsByRow[rowNumber].slice(0, remainingSeats);
          seatsToBook = [...seatsToBook, ...seatsFromRow];
          remainingSeats -= seatsFromRow.length;
          
          if (remainingSeats <= 0) break;
        }
      }
    }
    
    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        numberOfSeats,
      },
    });
    
    // Book the selected seats
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