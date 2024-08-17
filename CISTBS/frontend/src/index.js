import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './index.scss';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import { ConfigProvider } from './contexts/ConfigContext';

const domain = "dev-7enfb3ecm1kzsr0z.us.auth0.com"
const clientId = "9TBAmZvhPLhOpqR5kRC0nWxcHucJEpaf"

// const root = ReactDOM.createRoot(document.getElementById('root'));
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
<Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
  <ConfigProvider>
    <App />
  </ConfigProvider>
  </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
