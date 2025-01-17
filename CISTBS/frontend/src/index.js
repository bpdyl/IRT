import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './index.scss';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from './contexts/ConfigContext';
import { Auth0ProviderWithNavigate } from './store/Auth0ProviderWithNavigate';
import { Provider as ReduxProvider } from 'react-redux'; // <-- Import Redux Provider
import store from './redux/store/store'; // <-- Import Redux store

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));
const container = document.getElementById('root');
const root = createRoot(container);


root.render(
<ReduxProvider store={store}>  {/* <-- Add Redux Provider here */}
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
</ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
