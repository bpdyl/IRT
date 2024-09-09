import React, { useState } from 'react';
import TaskModal from './TaskModal';
import noTasksImage from './action_items-83faa0083fd70c36e165471d68f6b34276b28d56706b19ba1e9279057a14b367.svg'

import './Tasks.scss';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="sort-by">
          <label htmlFor="sort-tasks">Sort by:</label>
          <select id="sort-tasks" className="sort-dropdown">
            <option value="due-date">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <button className="new-task-button" onClick={handleCreateTask}>
          + New Task
        </button>
      </div>

      {/* No Tasks Placeholder */}
      {tasks.length === 0 ? (
        <div className="no-tasks-placeholder">
          <img
            src={noTasksImage} // Your image here
            alt="No Tasks"
            className="placeholder-image"
          />
          <p className="no-tasks-message">
            It looks like there are no tasks for this Incident yet.
          </p>
          <button className="create-task-link" onClick={handleCreateTask}>
            + Create Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {/* Render tasks here */}
        </div>
      )}

      {/* Reusable Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Tasks;
