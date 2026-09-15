import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../api/booking.api';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getPanditBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      setError('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);
      if (action === 'accept') {
        await bookingApi.acceptBooking(id);
      } else {
        await bookingApi.rejectBooking(id);
      }
      // Refresh list
      fetchBookings();
    } catch (err) {
      alert(err.message || `Failed to ${action} booking`);
    } finally {
      setActionLoading(null);
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

  if (loading) return <Loader message="Loading requests..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Incoming Booking Requests</h2>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">You have no booking requests at the moment.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="w-full sm:w-2/3">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{booking.pujaId?.name}</h3>
                {getStatusBadge(booking.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400 shrink-0" />
                  <span className="truncate">{booking.userId?.name} ({booking.userId?.phone})</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400 shrink-0" />
                  {new Date(booking.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400 shrink-0" />
                  {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                  <span className="line-clamp-2">{booking.locationType === 'home' ? booking.address : 'At Temple'}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full sm:w-1/3 flex sm:flex-col gap-2 justify-end">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleAction(booking._id, 'accept')}
                    disabled={actionLoading === booking._id}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(booking._id, 'reject')}
                    disabled={actionLoading === booking._id}
                    className="flex-1 sm:flex-none bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
