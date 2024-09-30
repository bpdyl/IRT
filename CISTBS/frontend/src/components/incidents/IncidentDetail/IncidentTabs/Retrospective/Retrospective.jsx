// Retrospective.jsx

import React, { useState, useEffect, useRef } from 'react';
import './Retrospective.scss';
import RetroPendingImage from './pending.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircle,
  faCircleNotch,
  faCalendarAlt,
  faUser,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import EditDataModal from './EditDataModal';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchIncident,
  updateIncident,
  fetchRetrospective,
  updateRetrospective,
} from '../../../../../redux/reducer/incidentSlice';
import { useParams } from 'react-router-dom';

const Retrospective = ({ incidentId }) => {
  const dispatch = useDispatch();
  // const { incidentId } = useParams();

  // Access incident data from Redux store
  const incidentState = useSelector((state) => state.incident);
  const { incident, retrospective } = incidentState;

  const [isResolved, setIsResolved] = useState(false);

  const [expandedStep, setExpandedStep] = useState(null);

  // Single owner and due date for the retrospective as a whole
  const [dueDate, setDueDate] = useState('');

  const [isOwnerDropdownOpen, setOwnerDropdownOpen] = useState(false);
  const [assignedOwner, setAssignedOwner] = useState(null);

  const [users] = useState([
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Williams' },
    // Add more users as needed
  ]);

  // Refs for dropdowns
  const ownerDropdownRef = useRef(null);
  const dueDateInputRef = useRef(null);

  // Steps state
  const [steps, setSteps] = useState([
    {
      id: 1,
      name: 'Gather & Confirm Data',
      status: 'To do',
      description:
        "Let's double-check the data filled out or missed during the incident is accurate.",
      editLabel: 'Edit Data',
      isStatusDropdownOpen: false,
    },
    {
      id: 2,
      name: 'Write the Retrospective Document',
      status: 'To do',
      description:
        'Prepare your write-up on the contributing factors and causes of the incident.',
      editLabel: 'Edit Retrospective Doc',
      isStatusDropdownOpen: false,
    },
    {
      id: 3,
      name: 'Publish Retrospective Document',
      status: 'To do',
      description:
        'Share the completed retrospective with relevant stakeholders.',
      editLabel: 'Publish',
      isStatusDropdownOpen: false,
    },
  ]);

  const statusIconMap = {
    'To do': faCircle,
    'In progress': faCircleNotch,
    'Completed': faCheckCircle,
  };

  // Set isResolved based on incident status from Redux store
  useEffect(() => {
    setIsResolved(incident?.status === 'Resolved');
  }, []);

  // Close owner dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ownerDropdownRef.current &&
        !ownerDropdownRef.current.contains(event.target)
      ) {
        setOwnerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close status dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setSteps((prevSteps) =>
          prevSteps.map((step) =>
            step.isStatusDropdownOpen
              ? { ...step, isStatusDropdownOpen: false }
              : step
          )
        );
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleStepDetails = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  // State for EditDataModal
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false);

  const handleEditStep = (stepId, editLabel) => {
    if (stepId === 1) {
      setIsEditDataModalOpen(true);
    } else {
      alert(`${editLabel} for step ${stepId}`);
    }
  };

  const handleSaveEditData = async ({ incidentData, retrospectiveData }) => {
    try {
      // Update incident data
      await dispatch(
        updateIncident({ incidentId: incidentId, data: incidentData })
      ).unwrap();

      // Update Retrospective
      await dispatch(
        updateRetrospective({
          incidentId: incidentId,
          data: retrospectiveData,
        })
      ).unwrap();

      // Update steps status
      setSteps((prevSteps) =>
        prevSteps.map((step) =>
          step.id === 1 ? { ...step, status: 'Completed' } : step
        )
      );
    } catch (error) {
      console.error('Failed to update incident data:', error);
    }
  };

  const handleStatusChange = (event, stepId, newStatus) => {
    event.stopPropagation();
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, status: newStatus, isStatusDropdownOpen: false }
          : step
      )
    );
  };

  const toggleOwnerDropdown = () => {
    setOwnerDropdownOpen(!isOwnerDropdownOpen);
  };

  const selectOwner = (user) => {
    setAssignedOwner(user);
    setOwnerDropdownOpen(false);
    // Dispatch an action to update the incident owner if necessary
  };

  // Handle due date container click
  const handleDueDateClick = (event) => {
    event.stopPropagation();
    if (dueDateInputRef.current) {
      if (dueDateInputRef.current.showPicker) {
        dueDateInputRef.current.showPicker();
      } else {
        dueDateInputRef.current.focus();
      }
    }
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
    // Dispatch an action to update the incident due date if necessary
  };

  // Toggle the status dropdown for a specific step
  const toggleStepStatusDropdown = (event, stepId) => {
    event.stopPropagation();
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? { ...step, isStatusDropdownOpen: !step.isStatusDropdownOpen }
          : step
      )
    );
  };

  return (
    <div className="retrospective-container">
      {isResolved ? (
        <>
          <div className="retrospective-header">
            <h2>Time for your Retrospective!</h2>
            <p>
              Conducting a retrospective helps your team identify root causes
              and do better next time.
            </p>
            <div className="retrospective-meta">
              {/* Due Date */}
              <div className="due-date-container">
                <label className="section-label">Due Date</label>
                <div className="due-date" onClick={handleDueDateClick}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={handleDueDateChange}
                    className="due-date-input"
                    ref={dueDateInputRef}
                  />
                </div>
              </div>
              {/* Assign Owner */}
              <div className="assign-owner-container">
                <label className="section-label">Owner</label>
                <div
                  className="assign-owner"
                  ref={ownerDropdownRef}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="assign-owner-button"
                    onClick={toggleOwnerDropdown}
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
                          onClick={() => selectOwner(user)}
                        >
                          <span>{user.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="progress-bar">
              <span>
                {
                  steps.filter((step) => step.status === 'Completed').length
                }
                /{steps.length} steps completed
              </span>
              <div className="progress">
                <div
                  className="progress-completed"
                  style={{
                    width: `${
                      (steps.filter((step) => step.status === 'Completed')
                        .length /
                        steps.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="retrospective-steps">
            {steps.map((step) => (
              <div key={step.id} className="step">
                <div
                  className="step-header"
                  onClick={() => toggleStepDetails(step.id)}
                >
                  {/* Status Icon Dropdown */}
                  <div
                    className="status-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="status-button"
                      onClick={(e) => toggleStepStatusDropdown(e, step.id)}
                    >
                      <FontAwesomeIcon
                        icon={statusIconMap[step.status]}
                        className="status-icon"
                        spin={step.status === 'In progress'}
                      />
                      <span>{step.status}</span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className="chevron-icon"
                      />
                    </button>
                    {/* Status Dropdown Menu */}
                    {step.isStatusDropdownOpen && (
                      <div className="dropdown-menu">
                        {['To do', 'In progress', 'Completed'].map((status) => (
                          <div
                            key={status}
                            className="dropdown-item"
                            onClick={(e) =>
                              handleStatusChange(e, step.id, status)
                            }
                          >
                            <FontAwesomeIcon
                              icon={statusIconMap[status]}
                              className="dropdown-icon"
                              spin={status === 'In progress'}
                            />
                            <span>{status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Step Name */}
                  <div className="step-name">{step.name}</div>

                  {/* Expand/Collapse Icon */}
                  <FontAwesomeIcon
                    icon={expandedStep === step.id ? faChevronUp : faChevronDown}
                    className="expand-icon"
                  />
                </div>

                {/* Step Details */}
                {expandedStep === step.id && (
                  <div className="step-details">
                    <p>{step.description}</p>
                    <button
                      className="edit-data-button"
                      onClick={() => handleEditStep(step.id, step.editLabel)}
                    >
                      {step.editLabel}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Edit Data Modal */}
          <EditDataModal
            isOpen={isEditDataModalOpen}
            onClose={() => setIsEditDataModalOpen(false)}
            onSave={handleSaveEditData}
            initialData={incident ? incident : {}}
            retrospectiveData={retrospective ? retrospective : {}}
          />
        </>
      ) : (
        <div className="retrospective-pending">
          <div className="pending-icon">
            <img src={RetroPendingImage} alt="Retrospective Pending" />
          </div>
          <h2>Retrospective Pending</h2>
          <p>
            Your retrospective process will show up once the incident is
            resolved.
          </p>
          <div className="progress-bar">
            <span>0/{steps.length} steps completed</span>
            <div className="progress">
              <div
                className="progress-completed"
                style={{ width: '0%' }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retrospective;
