import { useAuthFetch } from '../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../config/constant';


export const useTaskService = () => {
  const authFetch = useAuthFetch();

  // Fetch tasks for an incident
  const getTasks = async (incidentId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/tasks/`;
    return await authFetch(url); 
  };

  // Add a new task
  const createTask = async (incidentId, newTask) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/incidents/${incidentId}/tasks/`;
    return await authFetch(url, {
      method: 'POST',
      data: newTask,
    });
  };

  const updateTask = async (taskId, taskData) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/tasks/${taskId}/`;
    return await authFetch(url, {
      method: 'PATCH',
      data: taskData,
    });
  };

  // Delete a task
  const removeTask = async (taskId) => {
    const url = `${REACT_APP_API_SERVER_URL}/api/tasks/${taskId}/`;
    return await authFetch(url, { method: 'DELETE' });
  };

  return {
    getTasks,
    createTask,
    updateTask,
    removeTask,
  };
};
