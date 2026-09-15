import axiosInstance from './axiosInstance';

export const adminApi = {
  // Pandit Verification
  getPendingPandits: () => axiosInstance.get('/admin/pandits/pending'),
  verifyPandit: (id, status) => axiosInstance.patch(`/admin/pandits/${id}/verify`, { status }),

  // Puja Catalog Management
  getAllPujas: () => axiosInstance.get('/admin/pujas'),
  createPuja: (data) => axiosInstance.post('/admin/pujas', data),
  updatePuja: (id, data) => axiosInstance.put(`/admin/pujas/${id}`, data),
  deletePuja: (id) => axiosInstance.delete(`/admin/pujas/${id}`),

  // Platform Monitoring
  getAllBookings: (params) => axiosInstance.get('/admin/bookings', { params }),
  getAllUsers: () => axiosInstance.get('/admin/users'),
};
