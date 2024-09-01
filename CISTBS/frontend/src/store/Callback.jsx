// Callback.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/Loader/LoadingSpinner'; // Replace with your actual loading spinner component

const Callback = ({ appState }) => {
  const { isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const handleAuth = async () => {
      if (!isAuthenticated || isLoading) {
        setLoading(true); // Show loading until authentication is confirmed
        return;
      }

      try {
        // Fetch the token from Auth0
        const token = await getAccessTokenSilently();
        console.log('I am being called here from handleAuth');
        // Authenticate with the backend
        const response = await axios.post('http://localhost:8000/api/login', {
          auth_token: `Bearer ${token}`,
        });

        // Store the tokens from the backend in localStorage
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        // Redirect to the intended path or current path
        // navigate(appState?.returnTo || window.location.pathname);
      } catch (error) {
        console.error('Error during authentication:', error);
        // Handle errors, possibly redirect to an error page or login
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    handleAuth();
  }, [isAuthenticated, isLoading, getAccessTokenSilently, navigate, appState]);

  // Display a loading spinner while handling authentication
  if (loading || isLoading) {
    return <LoadingSpinner />; // Replace with your loading component
  }

  return null; // Return nothing as this component's job is to handle the redirect and tokens
};

export default Callback;
