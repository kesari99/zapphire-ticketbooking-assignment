export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Check if seats already exist
    const existingSeats = await prisma.seat.count();
    
    if (existingSeats > 0) {
      return NextResponse.json({ message: 'Database already seeded' });
    }
    
    // Create 80 seats with 7 seats per row (last row has 3 seats)
    const totalSeats = 80;
    const seatsPerRow = 7;
    const rows = Math.ceil(totalSeats / seatsPerRow);
    
    const seats = [];
    
    let seatNumber = 1;
    for (let row = 1; row <= rows; row++) {
      // For the last row, only add remaining seats
      const seatsInThisRow = row === rows ? totalSeats - (row - 1) * seatsPerRow : seatsPerRow;
      
      for (let i = 1; i <= seatsInThisRow; i++) {
        seats.push({
          seatNumber,
          rowNumber: row,
          isBooked: false
        });
        seatNumber++;
      }
    }
    
    await prisma.seat.createMany({
      data: seats
    });
    
    return NextResponse.json({ 
      message: `Created ${totalSeats} seats across ${rows} rows`,
      seats
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { message: 'Failed to seed database' },
      { status: 500 }
    );
  }
}