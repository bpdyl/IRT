import { Auth0Provider, AppState } from "@auth0/auth0-react";
import React, { PropsWithChildren, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from "../config/constant";


export const Auth0ProviderWithNavigate = ({
  children,
})=> {
  const navigate = useNavigate();
  const config = getConfig();

  const auth0Config = {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin+"/callback",
      ...(config.audience ? { audience: config.audience } : null),
      scope: 'openid profile email social_login',
    },
  };


const onRedirectCallback = (appState) => {
    const returnTo = appState?.returnTo || window.location.pathname;
    navigate(returnTo);
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
