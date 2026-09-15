import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../api/booking.api';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getMyBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1"/> {status.toUpperCase()}</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} className="mr-1"/> {status.toUpperCase()}</span>;
      case 'pending':
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle size={12} className="mr-1"/> PENDING</span>;
    }
  };

  if (loading) return <Loader message="Loading your bookings..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500 mb-4">You have no bookings yet.</p>
          <Link to="/" className="text-orange-600 hover:underline font-medium">Browse Pandits</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-bold text-gray-900">{booking.pujaId?.name}</h2>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="space-y-1 mt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2 text-gray-400" />
                    Pandit: <Link to={`/pandits/${booking.panditId?._id}`} className="ml-1 text-orange-600 hover:underline">{booking.panditId?.userId?.name}</Link>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                    <span>{booking.locationType === 'home' ? booking.address : 'At Temple'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-end text-right">
                <p className="text-sm text-gray-500">Booked on</p>
                <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
