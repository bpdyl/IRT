import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useLocation
import { getConfig } from "../config/constant";

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Access the current location (URL)
  const config = getConfig();

  // Construct the redirect URL with any query parameters
  const auth0Config = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: `${window.location.origin}/callback${location.search}`,  // Append the current query params to the redirect_uri
      ...(config.audience ? { audience: config.audience } : null),
      scope: 'openid profile email social_login',
    },
  };

  // Preserve query parameters in the redirect URL
  const onRedirectCallback = (appState) => {
    const returnTo = appState?.returnTo || window.location.pathname;
    const searchParams = new URLSearchParams(location.search);

    // Remove the `code` and `state` params from the URL (Auth0 callback params)
    searchParams.delete('code');
    searchParams.delete('state');

    const search = searchParams.toString();

    // Navigate to the cleaned URL with query params preserved (e.g., ?tab=Tasks)
    navigate(returnTo + (search ? `?${search}` : ''));
  };

  return (
    <Auth0Provider
      {...auth0Config}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
