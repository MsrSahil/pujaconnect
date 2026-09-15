import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await authApi.getMe();
          setUser(res.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check failed:", error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for unauthorized events from axios interceptor
    const handleUnauthorized = () => logout();
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentialsOrUser, token) => {
    let userData;
    let authToken;

    if (token && typeof token === 'string') {
      userData = credentialsOrUser;
      authToken = token;
    } else {
      const res = await authApi.login(credentialsOrUser);
      authToken = res.data.token;
      userData = res.data.user;
    }

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { token, user: userData } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
