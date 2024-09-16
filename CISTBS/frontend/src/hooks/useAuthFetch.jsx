import axios from 'axios';
import { refreshToken } from '../store/auth'; // Adjust import path as needed

export const useAuthFetch = () => {
  const authFetch = async (url, options = {}) => {
    let token = localStorage.getItem('accessToken');
    try {
      const response = await axios({
        url,
        method: options.method || 'GET', // Use GET as default method
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
        data: options.data || null, // Attach data if provided (for POST, PUT, etc.)
        params: options.params || null, // Attach query parameters if provided
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Attempt to refresh the token
        token = await refreshToken();
        if (token) {
          try {
            // Retry the original request with the new token
            const response = await axios({
              url,
              method: options.method || 'GET',
              headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
              },
              data: options.data || null,
              params: options.params || null,
            });
            return response.data;
          } catch (retryError) {
            throw retryError; // Handle error if retry also fails
          }
        }
      }
      throw error; // Handle other errors
    }
  };

  return authFetch;
};
