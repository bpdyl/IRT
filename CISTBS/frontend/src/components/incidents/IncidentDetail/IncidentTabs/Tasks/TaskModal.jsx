import React, { useState } from 'react';
import Modal from '../../../../../views/ui-elements/Modal/Modal';
import './TaskModal.scss';

const TaskModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, description, assignee });
      onClose(); // Close modal after saving
    }
  };

  const footer = (
    <>
      <button className="cancel-button" onClick={onClose}>
        Cancel
      </button>
      <button className="add-button" onClick={handleSave}>
        Add
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task" footer={footer}>
      <div className="modal-info">
        <p>A task is something you do during the incident that helps move it forward like troubleshooting.</p>
        <p className="slack-info">
          In Slack, react to any message with :star: emoji to create a task.
        </p>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="task-title">Title <span className="required">*</span></label>
          <textarea
            id="task-title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignee">Who should be assigned?</label>
          <select
            id="assignee"
            className="form-input"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Select user</option>
            <option value="User 1">User 1</option>
            <option value="User 2">User 2</option>
            <option value="User 3">User 3</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;
