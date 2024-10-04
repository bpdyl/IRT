// import React, { useState,useEffect } from 'react';
// import Modal from '../../../../../views/ui-elements/Modal/Modal';
// import { authFetch } from '../../../../../hooks/useAuthFetch';
// import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';
// import './TaskModal.scss';

// const TaskModal = ({ isOpen, onClose, onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [assignee, setAssignee] = useState('');


//   useEffect(() => {
//     // Fetch users for the assignee dropdown
//     const fetchUsers = async () => {
//       try {
//         const response = await authFetch(`${REACT_APP_API_SERVER_URL}/api/users/`);
//         setUsers(response);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };
    
//     fetchUsers();
//   }, [authFetch]);
//   const handleSave = () => {
//     if (title.trim()) {
//       onSave({ title, description, assignee });
//       onClose(); // Close modal after saving
//     }
//   };

//   const footer = (
//     <>
//       <button className="cancel-button" onClick={onClose}>
//         Cancel
//       </button>
//       <button className="add-button" onClick={handleSave}>
//         Add
//       </button>
//     </>
//   );

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Create Task" footer={footer}>
//       <div className="modal-info">
//         <p>A task is something you do during the incident that helps move it forward like troubleshooting.</p>
//         <p className="slack-info">
//           In Slack, react to any message with :star: emoji to create a task.
//         </p>
//       </div>

//       <div className="modal-body">
//         <div className="form-group">
//           <label htmlFor="task-title">Title <span className="required">*</span></label>
//           <textarea
//             id="task-title"
//             className="form-input"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="task-description">Description</label>
//           <textarea
//             id="task-description"
//             className="form-input"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="assignee">Who should be assigned?</label>
//           <select
//             id="assignee"
//             className="form-input"
//             value={assignee}
//             onChange={(e) => setAssignee(e.target.value)}
//           >
//             <option value="">Select user</option>
//             <option value="User 1">User 1</option>
//             <option value="User 2">User 2</option>
//             <option value="User 3">User 3</option>
//           </select>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default TaskModal;
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [dueDate, setDueDate] = useState(task ? task.due_date : '');
  const [priority, setPriority] = useState(task ? task.priority : 'Medium');
  const [assignee, setAssignee] = useState(task ? task.assignee?.id : null);
  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState({});  // To store error messages from backend
  const [frontendErrors, setFrontendErrors] = useState({});  // To store frontend validation errors

  const authFetch = useAuthFetch();

  useEffect(() => {
    // Fetch users for the assignee dropdown
    const fetchUsers = async () => {
      try {
        const response = await authFetch(`${REACT_APP_API_SERVER_URL}/api/users/`);
        console.log(response)
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
  }, []);

  // Frontend validation function
  const validateForm = () => {
    const validationErrors = {};
    if (!title.trim()) validationErrors.title = "Title is required.";
    if (!description.trim()) validationErrors.description = "Description is required.";
    if (!dueDate) validationErrors.due_date = "Due date is required.";
    if (!assignee) validationErrors.assignee_id = "Please select an assignee.";
    
    setFrontendErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;  // Returns true if no errors
  };

  // Handle form submission
  const handleSave = async () => {
    // Clear previous errors
    setErrors({});
    setFrontendErrors({});

    if (!validateForm()) {
      return;  // Exit if frontend validation fails
    }

    try {
      // Trigger onSave function passed as a prop (this will handle the API call)
      await onSave({ title, description, due_date: dueDate, priority, assignee_id: assignee });
      onClose();  // Close modal after successful save
    } catch (error) {
      // Catch and display backend validation errors
      if (error.response && error.response.data) {
        setErrors(error.response.data);  // Set backend errors
      } else {
        console.error('Error saving task:', error);
      }
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Edit Task' : 'Create Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Task Title */}
          <Form.Group controlId="formTaskTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              isInvalid={!!frontendErrors.title || !!errors.title}  // Show validation state
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
            <Form.Control.Feedback type="invalid">
              {frontendErrors.title || errors.title?.[0]}  {/* Show frontend or backend error */}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Task Description */}
          <Form.Group controlId="formTaskDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              isInvalid={!!frontendErrors.description || !!errors.description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
            <Form.Control.Feedback type="invalid">
              {frontendErrors.description || errors.description?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Task Due Date */}
          <Form.Group controlId="formTaskDueDate">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              value={dueDate}
              isInvalid={!!frontendErrors.due_date || !!errors.due_date}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {frontendErrors.due_date || errors.due_date?.[0]}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Task Priority */}
          <Form.Group controlId="formTaskPriority">
            <Form.Label>Priority</Form.Label>
            <Form.Control
              as="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Control>
          </Form.Group>

          {/* Task Assignee */}
          <Form.Group controlId="formTaskAssignee">
            <Form.Label>Assignee</Form.Label>
            <Form.Control
              as="select"
              value={assignee}
              isInvalid={!!frontendErrors.assignee_id || !!errors.assignee_id}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value={""}>Select assignee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name ? user.name : user.email}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {frontendErrors.assignee_id || errors.assignee_id?.[0]}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;

