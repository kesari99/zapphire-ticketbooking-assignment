// middleware.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'user'; // Use .env in production

// List of paths that don't require authentication
const publicPaths = ['/login', '/signup', '/api/auth/login', '/api/auth/signup','/api/seed'];

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if path is public
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }
  
  // Get token from cookie
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify token
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (app images)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
  ],
};