// src/auth.js

import axios from 'axios';

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('accessToken', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing token", error);
    // Refresh token is invalid or expired, redirect to login
    window.location.href = '/login'; // Adjust the path as needed
    return null;
  }
};
