import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin.api';
import { Loader } from '../../components/common/Loader';
import { Alert } from '../../components/common/Alert';

export const PlatformBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllBookings();
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      case 'completed': return 'text-blue-700 bg-blue-100';
      case 'cancelled': return 'text-gray-700 bg-gray-100';
      default: return 'text-yellow-700 bg-yellow-100';
    }
  };

  if (loading) return <Loader message="Loading platform bookings..." />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Bookings</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="py-3 px-4 text-sm font-bold text-gray-700">ID / Date</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700">Puja</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700">User</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700">Pandit</th>
              <th className="py-3 px-4 text-sm font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="text-xs text-gray-400 font-mono mb-1">{booking._id.slice(-6)}</div>
                  <div className="text-sm font-medium text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</div>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">{booking.pujaId?.name}</td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium">{booking.userId?.name}</div>
                  <div className="text-xs text-gray-500">{booking.userId?.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium">{booking.panditId?.userId?.name}</div>
                  <div className="text-xs text-gray-500">{booking.panditId?.userId?.phone}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
