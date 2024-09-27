// // RetrospectiveStep.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faCheckCircle,
//   faCircle,
//   faCircleNotch,
//   faPencilAlt,
//   faCalendarAlt,
//   faUser,
//   faChevronDown,
//   faChevronUp,
// } from '@fortawesome/free-solid-svg-icons';
// import './RetrospectiveStep.scss';

// const RetrospectiveStep = () => {
//   const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
//   const [stepStatus, setStepStatus] = useState('Completed'); // Default status
//   const [isExpanded, setExpanded] = useState(true); // Default expanded state

//   const [dueDate, setDueDate] = useState('2023-09-20'); // Default due date

//   const [isOwnerDropdownOpen, setOwnerDropdownOpen] = useState(false);
//   const [assignedOwner, setAssignedOwner] = useState(null); // Initially no owner assigned

//   const [users] = useState([
//     { id: 1, name: 'Alice Johnson' },
//     { id: 2, name: 'Bob Smith' },
//     { id: 3, name: 'Charlie Williams' },
//     // Add more users as needed
//   ]);

//   // Refs for dropdowns
//   const statusDropdownRef = useRef(null);
//   const ownerDropdownRef = useRef(null);

//   // Ref for due date input
//   const dueDateInputRef = useRef(null);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         statusDropdownRef.current &&
//         !statusDropdownRef.current.contains(event.target)
//       ) {
//         setStatusDropdownOpen(false);
//       }
//       if (
//         ownerDropdownRef.current &&
//         !ownerDropdownRef.current.contains(event.target)
//       ) {
//         setOwnerDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);

//     return () => {
//       // Clean up the event listener on component unmount
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Toggle functions
//   const toggleStatusDropdown = () => {
//     setStatusDropdownOpen(!isStatusDropdownOpen);
//   };

//   const toggleOwnerDropdown = () => {
//     setOwnerDropdownOpen(!isOwnerDropdownOpen);
//   };

//   // Change handlers
//   const changeStatus = (newStatus) => {
//     setStepStatus(newStatus);
//     setStatusDropdownOpen(false); // Close the dropdown after selecting
//   };

//   const selectOwner = (user) => {
//     setAssignedOwner(user);
//     setOwnerDropdownOpen(false); // Close the dropdown after selecting
//   };

//   const statusIconMap = {
//     'To do': faCircle,
//     'In progress': faCircleNotch,
//     'Completed': faCheckCircle,
//   };

//   // Handle due date container click
//   const handleDueDateClick = () => {
//     if (dueDateInputRef.current) {
//       if (dueDateInputRef.current.showPicker) {
//         dueDateInputRef.current.showPicker(); // Modern browsers
//       } else {
//         dueDateInputRef.current.focus(); // Fallback
//       }
//     }
//   };

//   return (
//     <details
//       className="step-details"
//       open={isExpanded}
//       onToggle={(e) => setExpanded(e.target.open)}
//     >
//       <summary className="step-summary">
//         <div className="step-header">
//           {/* Status Dropdown */}
//           <div className="status-dropdown" ref={statusDropdownRef}>
//             <button
//               type="button"
//               className="status-button"
//               onClick={toggleStatusDropdown}
//             >
//               <FontAwesomeIcon
//                 icon={statusIconMap[stepStatus]}
//                 className="status-icon"
//                 spin={stepStatus === 'In progress'}
//               />
//               <span>{stepStatus}</span>
//             </button>

//             {/* Status Dropdown Menu */}
//             {isStatusDropdownOpen && (
//               <div className="dropdown-menu">
//                 <div
//                   className="dropdown-item"
//                   onClick={() => changeStatus('To do')}
//                 >
//                   <FontAwesomeIcon icon={faCircle} className="dropdown-icon" />
//                   <span>To do</span>
//                 </div>
//                 <div
//                   className="dropdown-item"
//                   onClick={() => changeStatus('In progress')}
//                 >
//                   <FontAwesomeIcon
//                     icon={faCircleNotch}
//                     spin
//                     className="dropdown-icon"
//                   />
//                   <span>In progress</span>
//                 </div>
//                 <div
//                   className="dropdown-item"
//                   onClick={() => changeStatus('Completed')}
//                 >
//                   <FontAwesomeIcon
//                     icon={faCheckCircle}
//                     className="dropdown-icon"
//                   />
//                   <span>Completed</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Step Name */}
//           <div className="step-name">
//             Gather &amp; Confirm Data
//             <a className="edit-link" href="/edit/step">
//               <FontAwesomeIcon icon={faPencilAlt} />
//             </a>
//           </div>

//           {/* Due Date & Assign Owner */}
//           <div className="step-meta">
//             {/* Due Date Section */}
//             <div className="due-date-container">
//               <label className="section-label">Due Date</label>
//               <div className="due-date" onClick={handleDueDateClick}>
//                 <FontAwesomeIcon icon={faCalendarAlt} />
//                 <input
//                   type="date"
//                   value={dueDate}
//                   onChange={(e) => setDueDate(e.target.value)}
//                   className="due-date-input"
//                   ref={dueDateInputRef}
//                 />
//               </div>
//             </div>

//             {/* Assign Owner Section */}
//             <div className="assign-owner-container">
//               <label className="section-label">Owner</label>
//               <div className="assign-owner" ref={ownerDropdownRef}>
//                 <button
//                   type="button"
//                   className="assign-owner-button"
//                   onClick={toggleOwnerDropdown}
//                 >
//                   <FontAwesomeIcon icon={faUser} />
//                   <span>
//                     {assignedOwner ? assignedOwner.name : 'Assign Owner'}
//                   </span>
//                 </button>

//                 {/* Owner Dropdown Menu */}
//                 {isOwnerDropdownOpen && (
//                   <div className="dropdown-menu">
//                     {users.map((user) => (
//                       <div
//                         key={user.id}
//                         className="dropdown-item"
//                         onClick={() => selectOwner(user)}
//                       >
//                         <span>{user.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Expand/Collapse Icon */}
//         <FontAwesomeIcon
//           icon={isExpanded ? faChevronUp : faChevronDown}
//           className="expand-icon"
//         />
//       </summary>

//       {/* Step Details */}
//       <div className="step-body">
//         <p>
//           Let's double-check the data filled out or missed during the incident
//           is accurate.
//         </p>
//         <button
//           className="edit-data-button"
//           onClick={() => {
//             /* Handle edit data action */
//           }}
//         >
//           Edit Data
//         </button>
//       </div>
//     </details>
//   );
// };

// export default RetrospectiveStep;

// RetrospectiveStep.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircle,
  faCircleNotch,
  faPencilAlt,
  faCalendarAlt,
  faUser,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import './RetrospectiveStep.scss';

const RetrospectiveStep = () => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [stepStatus, setStepStatus] = useState('Completed'); // Default status
  const [isExpanded, setExpanded] = useState(true); // Default expanded state

  const [dueDate, setDueDate] = useState('2023-09-20'); // Default due date

  const [isOwnerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [assignedOwner, setAssignedOwner] = useState(null); // Initially no owner assigned

  const [users] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Williams' },
    // Add more users as needed
  ]);

  // Refs for dropdowns
  const statusDropdownRef = useRef(null);
  const ownerDropdownRef = useRef(null);

  // Ref for due date input
  const dueDateInputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false);
      }
      if (
        ownerDropdownRef.current &&
        !ownerDropdownRef.current.contains(event.target)
      ) {
        setOwnerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle functions
  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!isStatusDropdownOpen);
  };

  const toggleOwnerDropdown = () => {
    setOwnerDropdownOpen(!isOwnerDropdownOpen);
  };

  // Change handlers
  const changeStatus = (event, newStatus) => {
    event.preventDefault();
    event.stopPropagation();
    setStepStatus(newStatus);
    setStatusDropdownOpen(false);
  };

  const selectOwner = (event, user) => {
    event.preventDefault();
    event.stopPropagation();
    setAssignedOwner(user);
    setOwnerDropdownOpen(false);
  };


  const statusIconMap = {
    'To do': faCircle,
    'In progress': faCircleNotch,
    'Completed': faCheckCircle,
  };

  // Handle due date container click
  const handleDueDateClick = (event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent toggling the step
    if (dueDateInputRef.current) {
      if (dueDateInputRef.current.showPicker) {
        dueDateInputRef.current.showPicker(); // Modern browsers
      } else {
        dueDateInputRef.current.focus(); // Fallback
      }
    }
  };

  // Handle status button click
  const handleStatusButtonClick = (event) => {
    event.stopPropagation(); // Prevent toggling the step
    toggleStatusDropdown();
  };

  // Handle owner button click
  const handleOwnerButtonClick = (event) => {
    event.stopPropagation(); // Prevent toggling the step
    toggleOwnerDropdown();
  };

  // Handle edit link click
  const handleEditLinkClick = (event) => {
    event.stopPropagation(); // Prevent toggling the step
    // Handle edit action or navigation
  };

  // Handle expand/collapse icon click
  const handleExpandClick = (event) => {
    event.stopPropagation(); // Prevent default summary toggle
    setExpanded(!isExpanded);
  };

  return (
    <details className="step-details" open={isExpanded}>
      <summary className="step-summary">
        <div className="step-header">
          {/* Status Dropdown */}
          <div className="status-dropdown" ref={statusDropdownRef}>
            <button
              type="button"
              className="status-button"
              onClick={handleStatusButtonClick}
            >
              <FontAwesomeIcon
                icon={statusIconMap[stepStatus]}
                className="status-icon"
                spin={stepStatus === 'In progress'}
              />
              <span>{stepStatus}</span>
            </button>

            {/* Status Dropdown Menu */}
            {isStatusDropdownOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={(e) => changeStatus(e,'To do')}
                >
                  <FontAwesomeIcon icon={faCircle} className="dropdown-icon" />
                  <span>To do</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => changeStatus(e,'In progress')}
                >
                  <FontAwesomeIcon
                    icon={faCircleNotch}
                    spin
                    className="dropdown-icon"
                  />
                  <span>In progress</span>
                </div>
                <div
                  className="dropdown-item"
                  onClick={(e) => changeStatus(e,'Completed')}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="dropdown-icon"
                  />
                  <span>Completed</span>
                </div>
              </div>
            )}
          </div>

          {/* Step Name */}
          <div className="step-name">
            Gather &amp; Confirm Data
            <a
              className="edit-link"
              href="/edit/step"
              onClick={handleEditLinkClick}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </a>
          </div>

          {/* Due Date & Assign Owner */}
          <div className="step-meta">
            {/* Due Date Section */}
            <div className="due-date-container">
              <label className="section-label">Due Date</label>
              <div className="due-date" onClick={handleDueDateClick}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="due-date-input"
                  ref={dueDateInputRef}
                />
              </div>
            </div>

            {/* Assign Owner Section */}
            <div className="assign-owner-container">
              <label className="section-label">Owner</label>
              <div className="assign-owner" ref={ownerDropdownRef}>
                <button
                  type="button"
                  className="assign-owner-button"
                  onClick={handleOwnerButtonClick}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>
                    {assignedOwner ? assignedOwner.name : 'Assign Owner'}
                  </span>
                </button>

                {/* Owner Dropdown Menu */}
                {isOwnerDropdownOpen && (
                  <div className="dropdown-menu">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="dropdown-item"
                        onClick={(e) => selectOwner(e,user)}
                      >
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <FontAwesomeIcon
          icon={isExpanded ? faChevronUp : faChevronDown}
          className="expand-icon"
          onClick={handleExpandClick}
          aria-expanded={isExpanded}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(!isExpanded);
            }
          }}
        />
      </summary>

      {/* Step Details */}
      <div className="step-body">
        <p>
          Let's double-check the data filled out or missed during the incident
          is accurate.
        </p>
        <button
          className="edit-data-button"
          onClick={() => {
            /* Handle edit data action */
          }}
        >
          Edit Data
        </button>
      </div>
    </details>
  );
};

export default RetrospectiveStep;




