// import React from 'react';
// import './IncidentHeader.scss';  // You can define your styles here

// const IncidentHeader = () => {
//   return (
//     <div className="incident-header">
//       {/* Status */}
//       <div className="status">
//         <span className="status-badge active">Active</span>
//         <span className="incident-title">favorite_items table has been dropped</span>
//         <span className="incident-id">#2 Example</span>
//       </div>
      
//       {/* Description */}
//       <div className="description">
//         <p>
//           DROP TABLE has been executed on production environment instead of staging. Lorem Ipsum is simply dummy text of the printing and typesetting industry...
//         </p>
//       </div>
//       {/* Action Button */}
//       <div className="action-buttons">
//         <button className="action-button">View Retrospective</button>
//         <button className="action-button">Edit Integrations</button>
//         <button className="action-button">Assign Roles</button>
//     </div>
//     </div>
//   );
// };

// export default IncidentHeader;
import React, { useState } from 'react';
import './IncidentHeader.scss';

const IncidentHeader = ({ title, description, status, incidentId, onSaveTitle, onSaveDescription }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);

    // Toggle editing mode for title
    const handleTitleClick = () => {
        setIsEditingTitle(true);
    };

    // Toggle editing mode for description
    const handleDescriptionClick = () => {
        setIsEditingDescription(true);
    };

    // Save title and exit editing mode
    const handleTitleSave = () => {
        setIsEditingTitle(false);
        if (newTitle !== title) {
            onSaveTitle(newTitle);  // Call parent function to save title
        }
    };

    // Save description and exit editing mode
    const handleDescriptionSave = () => {
        setIsEditingDescription(false);
        if (newDescription !== description) {
            onSaveDescription(newDescription);  // Call parent function to save description
        }
    };

    return (
        <div className="incident-header">
            {/* Status */}
            <div className="status">
                <span className={`status-badge ${status === 'Active' ? 'active' : ''}`}>{status}</span>
            </div>

            {/* Incident title (Editable) */}
            {isEditingTitle ? (
              <div className="inline-editor">
                  <input
                      type="text"
                      className="inline-input"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <button className="save-button" onClick={handleTitleSave}>
                  ✓
                  </button>
                  <button className="cancel-button" onClick={() => setIsEditingTitle(false)}>
                  ✗
                  </button>
              </div>
          ) : (
              <h1
                  className="incident-title"
                  onClick={handleTitleClick}
                  title="Click to edit title"
              >
                  {newTitle} <span className="incident-id">#{incidentId}</span>
              </h1>
          )}

            {/* Divider */}

            {/* Description (Editable) */}
            <div className="description">
                {isEditingDescription ? (
                    <div className="inline-editor">
                        <textarea
                            className="inline-textarea"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <button className="save-button" onClick={handleDescriptionSave}>✓</button>
                        <button className="cancel-button" onClick={() => setIsEditingDescription(false)}>✗</button>
                    </div>
                ) : (
                    <p
                        className="incident-description"
                        onClick={handleDescriptionClick}
                        title="Click to edit description"
                    >
                        {newDescription}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button className="action-button">View Retrospective</button>
                <button className="action-button">Edit Integrations</button>
                <button className="action-button">Manage Roles</button>
            </div>
        </div>
    );
};

export default IncidentHeader;
