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

  // Fetch all teams
  const fetchTeams = async () => {
    const url = `${REACT_APP_API_SERVER_URL}/api/teams/`;
    const response = await authFetch(url);
    return response;
  };

  // Fetch team members based on selected teams
  const fetchteamUsers = async (teamIds) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/users-by-teams?team_ids=${teamIds.join(',')}`;
    const response = await authFetch(url);
    return response.map(user => ({ value: user._id, label: user.name || user.email }));
  };

  // Fetch severity choices
  const fetchSeverities = async () => {
    const url = `${REACT_APP_API_SERVER_URL}/api/severities/`;
    const response = await authFetch(url);
    return response.map(severity => ({ value: severity.name, label: severity.name }));
  };

  // Create severity
  const createSeverity = async (data) => {
    const response = await authFetch(`${REACT_APP_API_SERVER_URL}/api/severities/`, {
        method: 'POST',
        data,
    });
    return response;
};

    // Fetch severity choices
  const fetchIncidentTypes = async () => {
      const url = `${REACT_APP_API_SERVER_URL}/api/incident-types/`;
      const response = await authFetch(url);
      return response;
    };

  // Create incident type
  const createIncidentType = async (data) => {
    const response = await authFetch(`${REACT_APP_API_SERVER_URL}/api/incident-types/`, {
        method: 'POST',
        data,
    });
    return response;
};

  // Fetch all teams
  const fetchIncidentRoles = async () => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incident-roles/`;
    const response = await authFetch(url);
    return response;
  };

  // Create a new incident
  const createIncident = async (data) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/`;
    return await authFetch(url, {
      method: 'POST',
      data
    });
  };

  // Create a new team
  const createTeam = async (teamName) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/teams/`;
    return await authFetch(url, {
      method: 'POST',
      data: { name: teamName }
    });
  };


  return {
    getIncident,
    updateIncidentTitle,
    updateIncidentDescription,
    fetchTeams,
    fetchteamUsers,
    fetchSeverities,
    createSeverity,
    fetchIncidentTypes,
    createIncidentType,
    fetchIncidentRoles,
    createIncident,
    createTeam,
  };
};
