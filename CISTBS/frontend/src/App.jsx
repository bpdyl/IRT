import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import routes, { renderRoutes } from './routes';
import LoadingSpinner from './components/Loader/LoadingSpinner';

function App() {
  const { loginWithRedirect, isAuthenticated, isLoading: authLoading } = useAuth0();

  // Show loading spinner while checking authentication status or syncing user data
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Automatically redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
    return <LoadingSpinner />;
  }

  return (
      renderRoutes(routes)
  );
}

export default App;
