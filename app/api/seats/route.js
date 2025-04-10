import prisma from '@/app/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: [
        { rowNumber: 'asc' },
        { seatNumber: 'asc' },
      ],
    });
    
    return NextResponse.json(seats);
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch seats' },
      { status: 500 }
    );
  }
}
