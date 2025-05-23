export const dynamic = 'force-dynamic'; // avoid static optimization
export const runtime = 'nodejs'; // Important to force Node.js


import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'user'; 

export async function GET(request) {
  try {
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized - User not found' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { message: 'Unauthorized - Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}