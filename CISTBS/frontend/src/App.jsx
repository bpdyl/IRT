import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import routes, { renderRoutes } from './routes';
import { useAuth0 } from "@auth0/auth0-react";
function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  // Automatically redirect to login if not authenticated

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

    // Optional: Show loading spinner while checking authentication status
    // if (isLoading) {
    //   return <div>Loading...</div>;
    // }

  // return (
  //   <Router>
  //     {renderRoutes(routes)}
  //   </Router>

  // );
  return (
    <div>
      {isAuthenticated && (
        <>
          <button 
          className="label theme-bg2 text-white f-12"
          style={{
    position: 'fixed',
    top: '20px', 
    right: '20px',
    zIndex: 10000 // Ensure the button is always above other elements
  }} onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
          <Router>
          {renderRoutes(routes)}
          </Router>
        </>
      )}
    </div>
  );
}

export default App;
