import React, { useState } from 'react';
import './AssignRoles.scss'; // You'll need to style this component as per your design.

const AssignRoles = ({ onClose }) => {
  const [assignments, setAssignments] = useState([{ email: '', role: '' }]);

  const handleAddAssignment = () => {
    setAssignments([...assignments, { email: '', role: '' }]);
  };

  const handleRemoveAssignment = (index) => {
    const newAssignments = [...assignments];
    newAssignments.splice(index, 1);
    setAssignments(newAssignments);
  };

  const handleEmailChange = (index, value) => {
    const newAssignments = [...assignments];
    newAssignments[index].email = value;
    setAssignments(newAssignments);
  };

  const handleRoleChange = (index, value) => {
    const newAssignments = [...assignments];
    newAssignments[index].role = value;
    setAssignments(newAssignments);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Assign Roles</h2>
        {assignments.map((assignment, index) => (
          <div key={index} className="assignment-row">
            <input
              type="email"
              placeholder="Email"
              value={assignment.email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
            />
            <select
              value={assignment.role}
              onChange={(e) => handleRoleChange(index, e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Retrospective Owner">Retrospective Owner</option>
              <option value="Custom Role">Custom Role</option>
            </select>
            {/* Remove button now below the input and select */}
            <button className="remove-btn" onClick={() => handleRemoveAssignment(index)}>
              Remove
            </button>
          </div>
        ))}
        <button className="add-btn" onClick={handleAddAssignment}>
          Add Assignment
        </button>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AssignRoles;
