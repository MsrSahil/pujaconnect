import axiosInstance from './axiosInstance';

export const panditApi = {
  // Public
  getAll: (params) => axiosInstance.get('/pandits', { params }),
  getById: (id) => axiosInstance.get(`/pandits/${id}`),
  getAvailability: (id, params) => axiosInstance.get(`/pandits/${id}/availability`, { params }),
  
  // Private (Pandit Dashboard)
  getMyProfile: () => axiosInstance.get('/pandits/me'),
  updateMyProfile: (data) => axiosInstance.put('/pandits/me', data),
  getMyAvailability: (params) => axiosInstance.get('/pandits/me/availability', { params }),
  setMyAvailability: (data) => axiosInstance.post('/pandits/me/availability', data),
  deleteMyAvailability: (data) => axiosInstance.delete('/pandits/me/availability', { data }),
};
