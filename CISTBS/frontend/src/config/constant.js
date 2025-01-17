import configJson from '../auth_config.json'
export const BASE_URL = '/app/dashboard/';
export const BASE_TITLE = ' | Incident Response Tool';
export const REACT_APP_API_SERVER_URL = 'http://localhost:8000';

export const CONFIG = {
  layout: 'vertical',
  headerFixedLayout: true
};


export function getConfig() {
  // Configure the audience here. By default, it will take whatever is in the config
  // (specified by the `audience` key) unless it's the default value of "YOUR_API_IDENTIFIER" (which
  // is what you get sometimes by using the Auth0 sample download tool from the quickstart page, if you
  // don't have an API).
  // If this resolves to `null`, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience = configJson.audience 
  return {
    domain: configJson.domain,
    clientId: configJson.clientId,
    ...(audience ? { audience } : null),
  };
}