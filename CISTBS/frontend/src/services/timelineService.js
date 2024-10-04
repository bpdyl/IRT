// timelineService.js

import { useAuthFetch } from '../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../config/constant';

export const useTimelineService = () => {
  const authFetch = useAuthFetch();

  const getTimelineEvents = async (incidentId) => {
    // const url = `${REACT_APP_API_SERVER_URL}/api/timeline-events/?incident_id=${incidentId}`;
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/timeline-events/`;

    return await authFetch(url);
  };

  const createTimelineEvent = async (incidentId, newEvent) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/timeline-events/`;
    return await authFetch(url, {
      method: 'POST',
      data: { ...newEvent, incident: incidentId },
    });
  };

  const updateTimelineEvent = async (eventId, eventData) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/timeline-events/${eventId}/`;
    return await authFetch(url, {
      method: 'PATCH',
      data: eventData,
    });
  };

  const deleteTimelineEvent = async (eventId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/timeline-events/${eventId}/`;
    return await authFetch(url, { method: 'DELETE' });
  };

  //timeline-events/<int:event_id>/comments/
  const addComment = async (eventId, commentObj) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/timeline-events/${eventId}/comments/`;
    return await authFetch(url, {
      method: 'POST',
      data: { event: eventId, message: commentObj['message'] },
    });
  };

  return {
    getTimelineEvents,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addComment,
  };
};
