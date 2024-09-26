import axios from 'axios';
import { getAccessTokenSilently } from '@auth0/auth0-react';

export const handleAuthTokens = async () => {
  try {
    // Fetch the token from Auth0
    const token = await getAccessTokenSilently();
    console.log('Fetching token from Auth0');

    // Authenticate with the backend
    const response = await axios.post('http://localhost:8000/api/login', {
      auth_token: `Bearer ${token}`,
    });

    // Store the tokens from the backend in localStorage
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    return true;
  } catch (error) {
    console.error('Error during authentication:', error);
    return false;
  }
};
