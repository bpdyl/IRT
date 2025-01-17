// import React, { useState } from 'react';
// import AssignRoles from './AssignRoles'; // Import the AssignRoles component
// import './IncidentHeader.scss';

// const IncidentHeader = ({ title, description, status, incidentId, onSaveTitle, onSaveDescription }) => {
//     const [isEditingTitle, setIsEditingTitle] = useState(false);
//     const [isEditingDescription, setIsEditingDescription] = useState(false);
//     const [newTitle, setNewTitle] = useState(title);
//     const [newDescription, setNewDescription] = useState(description);
//     const [showAssignRoles, setShowAssignRoles] = useState(false); // State for showing popup

//     const handleTitleClick = () => setIsEditingTitle(true);
//     const handleDescriptionClick = () => setIsEditingDescription(true);
//     const handleTitleSave = () => {
//         setIsEditingTitle(false);
//         if (newTitle !== title) onSaveTitle(newTitle);
//     };
//     const handleDescriptionSave = () => {
//         setIsEditingDescription(false);
//         if (newDescription !== description) onSaveDescription(newDescription);
//     };
//     const handleManageRolesClick = () => setShowAssignRoles(true); // Show popup

//     return (
//         <div className="incident-header">
//             <div className="status">
//                 <span className={`status-badge ${status === 'Active' ? 'active' : ''}`}>{status}</span>
//             </div>

//             {isEditingTitle ? (
//                 <div className="inline-editor">
//                     <input
//                         type="text"
//                         className="inline-input"
//                         value={newTitle}
//                         onChange={(e) => setNewTitle(e.target.value)}
//                     />
//                     <button className="save-button" onClick={handleTitleSave}>✓</button>
//                     <button className="cancel-button" onClick={() => setIsEditingTitle(false)}>✗</button>
//                 </div>
//             ) : (
//                 <h1 className="incident-title" onClick={handleTitleClick} title="Click to edit title">
//                     {newTitle} <span className="incident-id">#{incidentId}</span>
//                 </h1>
//             )}

//             <div className="description">
//                 {isEditingDescription ? (
//                     <div className="inline-editor">
//                         <textarea
//                             className="inline-textarea"
//                             value={newDescription}
//                             onChange={(e) => setNewDescription(e.target.value)}
//                         />
//                         <button className="save-button" onClick={handleDescriptionSave}>✓</button>
//                         <button className="cancel-button" onClick={() => setIsEditingDescription(false)}>✗</button>
//                     </div>
//                 ) : (
//                     <p className="incident-description" onClick={handleDescriptionClick} title="Click to edit description">
//                         {newDescription}
//                     </p>
//                 )}
//             </div>

//             <div className="action-buttons">
//                 <button className="action-button">View Retrospective</button>
//                 <button className="action-button">Edit Integrations</button>
//                 <button className="action-button" onClick={handleManageRolesClick}>Manage Roles</button>
//             </div>

//             {showAssignRoles && <AssignRoles onClose={() => setShowAssignRoles(false)} />} {/* Conditionally render the popup */}
//         </div>
//     );
// };

// export default IncidentHeader;
import React, { useState } from 'react';
import './IncidentHeader.scss';
import AssignRoles from './AssignRoles'; // Import the AssignRoles component

const IncidentHeader = ({ title, description, status, incidentId, onSaveTitle, onSaveDescription }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);
    const [showAssignRoles, setShowAssignRoles] = useState(false); // State for showing popup

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

    
    const handleManageRolesClick = () => setShowAssignRoles(true); // Show popup

    return (
        <div className="incident-detail-header">
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
                  className="incident-detail-title"
                  onClick={handleTitleClick}
                  title="Click to edit title"
              >
                  {newTitle} <span className="incident-detail-id">#{incidentId}</span>
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
                        className="incident-detail-description"
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
                <button className="action-button" onClick={handleManageRolesClick}>Manage Roles</button>
                {showAssignRoles && <AssignRoles onClose={() => setShowAssignRoles(false)} />} {/* Conditionally render the popup */}
            </div>
        </div>
    );
};

export default IncidentHeader;