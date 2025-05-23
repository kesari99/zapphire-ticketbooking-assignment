export const dynamic = 'force-dynamic'; 
export const runtime = 'nodejs'; 


import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';

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
    
    jwt.verify(token, JWT_SECRET);
    
    await prisma.reservation.deleteMany({});
    
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