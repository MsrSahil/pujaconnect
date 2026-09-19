import axios from 'axios';

// Resolve backend API URL from environment variables, falling back to local dev URL
const rawBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api/v1';

// Ensure no trailing slash, and automatically append /api/v1 if not present
const cleanURL = rawBaseURL.replace(/\/+$/, '');
const normalizedBaseURL = cleanURL.endsWith('/api/v1') ? cleanURL : `${cleanURL}/api/v1`;

const axiosInstance = axios.create({
  baseURL: normalizedBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global errors (like token expiration)
axiosInstance.interceptors.response.use(
  (response) => response.data, // Unwrap ApiResponse
  (error) => {
    // Only dispatch unauthorized for non-login endpoints
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('unauthorized'));
    }

    // Return standard error format with detailed validation errors if available
    const serverErrors = error.response?.data?.errors;
    let message = error.response?.data?.message || 'Something went wrong';
    if (serverErrors && Array.isArray(serverErrors) && serverErrors.length > 0) {
      message = serverErrors.map((e) => e.message).join(', ');
    }

    const err = new Error(message);
    err.response = error.response;
    return Promise.reject(err);
  }
);

export default axiosInstance;
