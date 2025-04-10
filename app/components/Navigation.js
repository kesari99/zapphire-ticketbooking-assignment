'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ user, onLogout }) {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Train Reservation
              </Link>
            </div>
            
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Book Seats
              </Link>
              
              {/* <Link
                href="/reservations"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/reservations'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                My Reservations
              </Link> */}
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.name || user.email}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}