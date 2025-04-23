'use client';

export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navigation from './components/Navigation';

export default function Home() {
  const router = useRouter();
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data);
        fetchSeats();
      } catch (err) {
        router.push('/login');
      }
    };

    checkAuth();
  }, []);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/seats');
      setSeats(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch seats. Please try again.');
      setLoading(false);
    }
  };

  const bookSeats = async () => {
    if (numberOfSeats < 1 || numberOfSeats > 7) {
      setError('You can only book 1 to 7 seats at a time.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/reservations', {
        numberOfSeats: parseInt(numberOfSeats)
      });
      
      setMessage(`Successfully booked ${numberOfSeats} seat(s)!`);
      setError('');
      fetchSeats(); // Refresh seats data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book seats. Please try again.');
      setLoading(false);
    }
  };

  const resetAllSeats = async () => {
    try {
      setLoading(true);
      await axios.post('/api/reset');
      setMessage('All seats have been reset and are now available!');
      setError('');
      fetchSeats(); // Refresh seats data
    } catch (err) {
      setError('Failed to reset seats. Please try again.');
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

  // Group seats by row for display
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.rowNumber]) {
      acc[seat.rowNumber] = [];
    }
    acc[seat.rowNumber].push(seat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} onLogout={handleLogout} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Book Your Seats</h1>
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div>
              <label htmlFor="numberOfSeats" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Seats (1-7):
              </label>
              <input
                type="number"
                id="numberOfSeats"
                min="1"
                max="7"
                value={numberOfSeats}
                onChange={(e) => setNumberOfSeats(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={bookSeats}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Book Seats
              </button>
              
              <button
                onClick={resetAllSeats}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                Reset All Seats
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Seat Layout</h2>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                {Object.keys(seatsByRow).map((rowNumber) => (
                  <div key={rowNumber} className="flex mb-2 justify-center">
                    <div className="mr-2 w-8 flex items-center justify-center font-bold">
                      R{rowNumber}
                    </div>
                    <div className="flex gap-2">
                      {seatsByRow[rowNumber].map((seat) => (
                        <div
                          key={seat.id}
                          className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer text-sm font-medium ${
                            seat.isBooked
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          title={seat.isBooked ? 'Booked' : 'Available'}
                        >
                          {seat.seatNumber}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 justify-center mt-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 mr-2 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 mr-2 rounded"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}