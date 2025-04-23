export const dynamic = 'force-dynamic'; 
export const runtime = 'nodejs'; 


import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none', 
      maxAge: 0, 
    });
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { message: 'Failed to log out' },
      { status: 500 }
    );
  }
}

