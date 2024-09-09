import React, { useState, useEffect } from 'react';
import Modal from '../../../../../views/ui-elements/Modal/Modal';
import './FollowUpModal.scss';

const FollowUpModal = ({ isOpen, onClose, onSave, initialData = null, mode = 'create' }) => {
  // Form state variables
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  // Reset form fields when switching to "create" mode or when opening the modal
  useEffect(() => {
    if (mode === 'create') {
      setTitle('');         // Reset title
      setDescription('');   // Reset description
      setAssignee('');      // Reset assignee
      setPriority('Medium'); // Default priority
      setDueDate('');       // Reset due date
    }
  }, [mode, isOpen]);

  // Populate form fields when in "edit" mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setAssignee(initialData.assignee);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate);
    }
  }, [initialData, mode]);

  const handleSave = () => {
    if (title.trim()) {
      const followUpData = {
        title,
        description,
        assignee,
        priority,
        dueDate,
      };
      onSave(followUpData);
      onClose(); // Close the modal after saving
    }
  };

  const footer = (
    <>
      <button className="cancel-button" onClick={onClose}>
        Cancel
      </button>
      <button className="add-button" onClick={handleSave}>
        {mode === 'edit' ? 'Save Changes' : 'Add'}
      </button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? 'Edit Follow Up' : 'Create Follow Up'} footer={footer}>
      {/* Info message only for create mode */}
      {mode === 'create' && (
        <div className="modal-info">
          <p>A follow-up is something you do after the incident is resolved to prevent future occurrences like refactoring a piece of code.</p>
          <p className="slack-info">In Slack, react to any message with :pencil: emoji to create a follow-up.</p>
        </div>
      )}

      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="follow-up-title">Title <span className="required">*</span></label>
          <textarea
            id="follow-up-title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="follow-up-description">Description</label>
          <textarea
            id="follow-up-description"
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

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="form-input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FollowUpModal;
