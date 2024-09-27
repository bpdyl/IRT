

// import React, { useState, useEffect } from 'react';
// import './Retrospective.scss'; 
// import RetroPendingImage from './pending.svg';

// const Retrospective = ({ incident }) => {
//   const [isResolved, setIsResolved] = useState(false);
//   const incidentStatus = incident.status;

//   const [expandedStep, setExpandedStep] = useState(null);  // New state to track expanded step

//   const [steps, setSteps] = useState([
//     { id: 1, name: 'Gather & Confirm Data', isCompleted: true, dueDate: 'September 20', owner: null, description: "Let's double-check the data filled out or missed during the incident is accurate.", editLabel: 'Edit Data' },
//     { id: 2, name: 'Write the Retrospective Document', isCompleted: true, dueDate: 'September 20', owner: null, description: 'Prepare your write up on the contributing factors and causes of the incident.', editLabel: 'Edit Retrospective Doc' },
//     { id: 3, name: 'Host Retrospective Meeting', isCompleted: false, dueDate: 'September 24', owner: null, description: 'Find a time to debrief on what you’ve learned about the incident and outline steps moving forward.', editLabel: 'Schedule Meeting' },
//     { id: 4, name: 'Create Follow-Up Action Items', isCompleted: true, dueDate: 'September 20', owner: null, description: 'What should be done now the incident is over? We’ll track it for you here and sync up with any ticketing tool if applicable.', editLabel: 'New Follow-up' },
//     { id: 5, name: 'Share the Finalized Retrospective', isCompleted: false, dueDate: 'No Due Date', owner: null, description: 'Share the completed retrospective with relevant stakeholders.', editLabel: 'Share' }
//   ]);

//   useEffect(() => {
//     // Update based on incident status
//     setIsResolved(incidentStatus === 'Resolved');
//   }, [incidentStatus]);

//   const toggleStepDetails = (stepId) => {
//     setExpandedStep(expandedStep === stepId ? null : stepId); // Toggle step details
//   };

//   const handleAssignOwner = (stepId) => {
//     alert(`Assign owner for step ${stepId}`);
//   };

//   const handleEditStep = (stepId, editLabel) => {
//     alert(`${editLabel} for step ${stepId}`);
//   };

//   return (
//     <div className="retrospective-container">
//       {isResolved ? (
//         <>
//           <div className="retrospective-header">
//             <h2>Time for your Retrospective!</h2>
//             <p>Conducting a retrospective helps your team identify root causes and do better next time.</p>
//             <div className="progress-bar">
//               <span>{steps.filter(step => step.isCompleted).length}/{steps.length} steps completed</span>
//               <div className="progress">
//                 <div
//                   className="progress-completed"
//                   style={{ width: `${(steps.filter(step => step.isCompleted).length / steps.length) * 100}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           <div className="retrospective-steps">
//             {steps.map((step) => (
//               <div key={step.id} className="step">
//                 <div className="step-header" onClick={() => toggleStepDetails(step.id)}>
//                   {/* Step Name and Edit Button */}
//                   <span className={step.isCompleted ? 'completed' : ''}>
//                     {step.name}
//                   </span>

//                   {/* Due Date */}
//                   <span className="step-due-date">
//                     {step.isCompleted ? `Completed ${step.dueDate}` : step.dueDate ? `Due ${step.dueDate}` : 'No Due Date'}
//                   </span>

//                   {/* Assign Owner Button */}
//                   <button className="step-assign-button" onClick={() => handleAssignOwner(step.id)}>
//                     {step.owner ? `Assigned to ${step.owner}` : 'Assign Owner'}
//                   </button>
//                 </div>

//                 {/* Step Details (Toggleable) */}
//                 {expandedStep === step.id && (
//                   <div className="step-details">
//                     <p>{step.description}</p>
//                     <button className="step-edit-button" onClick={() => handleEditStep(step.id, step.editLabel)}>
//                       {step.editLabel}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <div className="retrospective-pending">
//           <div className="pending-icon">
//             <img src={RetroPendingImage} alt="Retrospective Pending" />
//           </div>
//           <h2>Retrospective Pending</h2>
//           <p>Your retrospective process will show up once the incident is resolved.</p>
//           <div className="progress-bar">
//             <span>0/5 steps completed</span>
//             <div className="progress">
//               <div className="progress-completed" style={{ width: '0%' }}></div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Retrospective;


import React, { useState, useEffect } from 'react';
import './Retrospective.scss';
import RetroPendingImage from './pending.svg';
import RetrospectiveStep from './RetrospectiveStep';

const Retrospective = ({ incident }) => {
  const [isResolved, setIsResolved] = useState(false);
  const incidentStatus = incident.status;

  const [expandedStep, setExpandedStep] = useState(null); // To track expanded step
  const [steps, setSteps] = useState([
    { id: 1, name: 'Gather & Confirm Data', status: 'Completed', dueDate: 'September 20', owner: null, description: "Let's double-check the data filled out or missed during the incident is accurate.", editLabel: 'Edit Data' },
    { id: 2, name: 'Write the Retrospective Document', status: 'Completed', dueDate: 'September 20', owner: null, description: 'Prepare your write-up on the contributing factors and causes of the incident.', editLabel: 'Edit Retrospective Doc' },
    { id: 3, name: 'Host Retrospective Meeting', status: 'In progress', dueDate: 'September 24', owner: null, description: 'Find a time to debrief on what you’ve learned about the incident and outline steps moving forward.', editLabel: 'Schedule Meeting' },
    { id: 4, name: 'Create Follow-Up Action Items', status: 'Completed', dueDate: 'September 20', owner: null, description: 'What should be done now that the incident is over? We’ll track it for you here and sync up with any ticketing tool if applicable.', editLabel: 'New Follow-up' },
    { id: 5, name: 'Share the Finalized Retrospective', status: 'To do', dueDate: 'No Due Date', owner: null, description: 'Share the completed retrospective with relevant stakeholders.', editLabel: 'Share' }
  ]);

  useEffect(() => {
    setIsResolved(incidentStatus === 'Resolved');
  }, [incidentStatus]);

  const toggleStepDetails = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId); // Toggle step details
  };

  const handleAssignOwner = (stepId) => {
    alert(`Assign owner for step ${stepId}`);
  };

  const handleEditStep = (stepId, editLabel) => {
    alert(`${editLabel} for step ${stepId}`);
  };

  const handleStatusChange = (stepId, newStatus) => {
    setSteps(steps.map(step => step.id === stepId ? { ...step, status: newStatus } : step));
  };
  return (<RetrospectiveStep></RetrospectiveStep>)
  return (
    <div className="retrospective-container">
      {isResolved ? (
        <>
          <div className="retrospective-header">
            <h2>Time for your Retrospective!</h2>
            <p>Conducting a retrospective helps your team identify root causes and do better next time.</p>
            <div className="progress-bar">
              <span>{steps.filter(step => step.status === 'Completed').length}/{steps.length} steps completed</span>
              <div className="progress">
                <div
                  className="progress-completed"
                  style={{ width: `${(steps.filter(step => step.status === 'Completed').length / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="retrospective-steps">
            {steps.map((step) => (
              <div key={step.id} className="step">
                <div className="step-header" onClick={() => toggleStepDetails(step.id)}>
                  {/* Status Icon Dropdown */}
                  <div className="step-status-dropdown">
                    <select
                      value={step.status}
                      onChange={(e) => handleStatusChange(step.id, e.target.value)}
                      className={`status-${step.status.toLowerCase()}`}
                    >
                      <option value="To do">To do</option>
                      <option value="Inprogress">In progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Step Name */}
                  <span className="step-name">
                    {step.name}
                  </span>

                  {/* Due Date */}
                  <span className="step-due-date">
                    {step.status === 'Completed' ? `Completed ${step.dueDate}` : step.dueDate ? `Due ${step.dueDate}` : 'No Due Date'}
                  </span>

                  {/* Assign Owner Button */}
                  <button className="step-assign-button" onClick={() => handleAssignOwner(step.id)}>
                    {step.owner ? `Assigned to ${step.owner}` : 'Assign Owner'}
                  </button>
                </div>

                {/* Step Details (Toggleable) */}
                {expandedStep === step.id && (
                  <div className="step-details">
                    <p>{step.description}</p>
                    <button className="step-edit-button" onClick={() => handleEditStep(step.id, step.editLabel)}>
                      {step.editLabel}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="retrospective-pending">
          <div className="pending-icon">
            <img src={RetroPendingImage} alt="Retrospective Pending" />
          </div>
          <h2>Retrospective Pending</h2>
          <p>Your retrospective process will show up once the incident is resolved.</p>
          <div className="progress-bar">
            <span>0/5 steps completed</span>
            <div className="progress">
              <div className="progress-completed" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retrospective;

