// src/services/incidentService.js
import { useAuthFetch } from '../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../config/constant';
export const useIncidentService = () => {
  const authFetch = useAuthFetch();  // Use the custom auth fetch hook

  // Fetch incident details
  const getIncident = async (incidentId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/`;
    const response = await authFetch(url);
    return response;  // <-- Make sure to return the response
  };

  // Update incident title
  const updateIncidentTitle = async (incidentId, newTitle) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/`;
    return await authFetch(url, {
      method: 'PATCH',
      data: { title: newTitle },
    });
  };

  // Update incident description
  const updateIncidentDescription = async (incidentId, newDescription) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/`;
    return await authFetch(url, {
      method: 'PATCH',
      data: { description: newDescription },
    });
  };

  return {
    getIncident,
    updateIncidentTitle,
    updateIncidentDescription,
  };
};
