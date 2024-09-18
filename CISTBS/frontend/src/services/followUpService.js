import { useAuthFetch } from '../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../config/constant';


export const useFollowUpService = () => {
  const authFetch = useAuthFetch();

  // Fetch follow_ups for an incident
  const getFollowUps = async (incidentId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/follow_ups/`;
    return await authFetch(url); 
  };

  // Add a new follow up
  const createFollowUp = async (incidentId, newFollowUp) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/follow_ups/`;
    return await authFetch(url, {
      method: 'POST',
      data: newFollowUp,
    });
  };

  const updateFollowUp = async (followUpId, taskData) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/follow_ups/${followUpId}/`;
    return await authFetch(url, {
      method: 'PATCH',
      data: taskData,
    });
  };

  // Delete a followup 
  const removeFollowUp = async (followUpId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/follow_ups/${followUpId}/`;
    return await authFetch(url, { method: 'DELETE' });
  };

  return {
    getFollowUps,
    createFollowUp,
    updateFollowUp,
    removeFollowUp,
  };
};
