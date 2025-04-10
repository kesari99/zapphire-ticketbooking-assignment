// app/api/reset/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'user'; 

export async function POST() {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Verify token
    jwt.verify(token, JWT_SECRET);
    
    // Delete all reservations
    await prisma.reservation.deleteMany({});
    
    // Reset all seats
    await prisma.seat.updateMany({
      data: {
        isBooked: false,
        reservationId: null,
      },
    });
    
    return NextResponse.json({ message: 'All seats have been reset successfully' });
  } catch (error) {
    console.error('Error resetting seats:', error);
    return NextResponse.json(
      { message: 'Failed to reset seats' },
      { status: 500 }
    );
  }
}