import axiosInstance from './axiosInstance';

export const pujaApi = {
  getAll: (params) => axiosInstance.get('/pujas', { params }),
};
