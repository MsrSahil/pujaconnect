import axiosInstance from './axiosInstance';

export const bookingApi = {
  // User endpoints
  create: (data) => axiosInstance.post('/bookings', data),
  getMyBookings: (params) => axiosInstance.get('/bookings/my', { params }),
  
  // Pandit endpoints
  getPanditBookings: (params) => axiosInstance.get('/pandits/me/bookings', { params }),
  acceptBooking: (id) => axiosInstance.patch(`/bookings/${id}/accept`),
  rejectBooking: (id) => axiosInstance.patch(`/bookings/${id}/reject`),
  
  // Admin endpoints
  getAllBookings: (params) => axiosInstance.get('/admin/bookings', { params }),
};
