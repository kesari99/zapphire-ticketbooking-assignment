export const dynamic = 'force-dynamic';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function Reservations() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data);
        fetchReservations();
      } catch (err) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservations');
      setReservations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch reservations. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (err) {
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Reservations</h1>

          {user && (
            <div className="flex items-center gap-4">
              <div className="text-sm">
                Welcome, <span className="font-semibold">{user.name || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 px-3 rounded"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; Back to Seat Selection
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {reservations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">You don&apos;t have any reservations yet.</p>
                <Link href="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Book Seats Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map((reservation) => {
                  const seatsByRow = reservation.seats.reduce((acc, seat) => {
                    if (!acc[seat.rowNumber]) {
                      acc[seat.rowNumber] = [];
                    }
                    acc[seat.rowNumber].push(seat);
                    return acc;
                  }, {});

                  return (
                    <div key={reservation.id} className="border border-gray-300 rounded-lg p-4">
                      <div className="mb-3 flex justify-between">
                        <div>
                          <p className="font-semibold">Reservation #{reservation.id}</p>
                          <p className="text-sm text-gray-600">
                            Booked on {new Date(reservation.createdAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {reservation.numberOfSeats} seats reserved
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium mb-2">Seats:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(seatsByRow).map((rowNumber) => (
                            <div key={rowNumber} className="flex items-center mr-4">
                              <span className="text-sm font-medium mr-1">Row {rowNumber}:</span>
                              {seatsByRow[rowNumber].map((seat) => (
                                <span
                                  key={seat.id}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md mr-1"
                                >
                                  {seat.seatNumber}
                                </span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
