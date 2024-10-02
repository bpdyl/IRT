// EditDataModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import ReactSelect from 'react-select';
import Modal from '../../../../../views/ui-elements/Modal/Modal';
import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';



import './EditDataModal.scss';

const EditDataModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  retrospectiveData = {},
  mode = 'edit',
}) => {
  // Form state variables
  const [retrospectiveTitle, setRetrospectiveTitle] = useState('');
  const [incidentTitle, setIncidentTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [acknowledgedAt, setAcknowledgedAt] = useState('');
  const [detectedAt, setDetectedAt] = useState('');
  const [mitigatedAt, setMitigatedAt] = useState('');
  const [resolvedAt, setResolvedAt] = useState('');
  const [mitigationDescription, setMitigationDescription] = useState('');
  const [resolutionDescription, setResolutionDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');


  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));
  const authFetch = useAuthFetch();

  // Function to format date for input field
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  }

  // Function to parse date from input field
  function parseDateFromInput(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  }

  // Fetch data for teams and types
  useEffect(() => {
    // Fetch teams
    const fetchTeams = async () => {
      try {
        const response = await authFetch(
          `${REACT_APP_API_SERVER_URL}/api/teams/`
        );
        setTeams(response);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };

    // Fetch incident types
    const fetchTypes = async () => {
      try {
        const response = await authFetch(
          `${REACT_APP_API_SERVER_URL}/api/incident-types/`
        );
        setTypes(response);
      } catch (error) {
        console.error('Failed to fetch incident types:', error);
      }
    };

    fetchTeams();
    fetchTypes();
  }, []);

  // Populate form fields when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setIncidentTitle(initialData.title || '');
        setSummary(initialData.description || '');
        setAcknowledgedAt(formatDateForInput(initialData.start_datetime));
        setDetectedAt(formatDateForInput(initialData.reported_date));
        setMitigatedAt(formatDateForInput(initialData.mitigation_datetime));
        setResolvedAt(formatDateForInput(initialData.resolution_datetime));
        setMitigationDescription(initialData.mitigation_description || '');
        setResolutionDescription(initialData.resolution_description || '');
        setSeverity(initialData.severity || '');
        setSelectedTeams(
          initialData.teams ? initialData.teams.map((team) => team.id) : []
        );
        setSelectedType(initialData.incident_type || '');
      }

      if (retrospectiveData) {
        setRetrospectiveTitle(retrospectiveData.title || '');
      } else {
        setRetrospectiveTitle('');
      }
    }
  }, [isOpen]);


  const handleSave = () => {
    if (retrospectiveTitle.trim()) {
      const incidentData = {
        // Fields for Incident model
        title: incidentTitle,
        description: summary,
        start_datetime: parseDateFromInput(acknowledgedAt),
        reported_date: parseDateFromInput(detectedAt),
        mitigation_datetime: parseDateFromInput(mitigatedAt),
        resolution_datetime: parseDateFromInput(resolvedAt),
        mitigation_description: mitigationDescription,
        resolution_description: resolutionDescription,
        severity: severity,
        team_ids: selectedTeams,
        incident_type: selectedType,
      };

      const retrospectiveData = {
        // Fields for Retrospective model
        title: retrospectiveTitle,
        // Include other retrospective fields if any
      };
      onSave({ incidentData, retrospectiveData });
      onClose(); // Close the modal after saving
    } else {
      alert('Please fill out the required fields.');
    }
  };

  const footer = (
    <>
      <button className="cancel-button" onClick={onClose}>
        Cancel
      </button>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gather & Confirm Data"
      footer={footer}
    >
      <div className="modal-body">
        <div className="form-group">
          <label htmlFor="retrospective-title">
            Retrospective Title <span className="required">*</span>
          </label>
          <input
            id="retrospective-title"
            className="form-input"
            type="text"
            value={retrospectiveTitle}
            onChange={(e) => setRetrospectiveTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="incident-title">Incident Title</label>
          <input
            id="incident-title"
            className="form-input"
            type="text"
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            className="form-input"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* Date Picker Fields */}
        {[
          {
            label: 'Acknowledged At',
            value: acknowledgedAt,
            onChange: setAcknowledgedAt,
            id: 'acknowledgedAt',
          },
          {
            label: 'Detected At',
            value: detectedAt,
            onChange: setDetectedAt,
            id: 'detectedAt',
          },
          {
            label: 'Mitigated At',
            value: mitigatedAt,
            onChange: setMitigatedAt,
            id: 'mitigatedAt',
          },
          {
            label: 'Resolved At',
            value: resolvedAt,
            onChange: setResolvedAt,
            id: 'resolvedAt',
          },
        ].map((field) => (
          <div className="form-group date-picker-group" key={field.id}>
            <label htmlFor={field.id}>{field.label}</label>
            <input
              type="datetime-local"
              id={field.id}
              className="form-input date-input"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="mitigation-description">
            How was the incident mitigated?
          </label>
          <textarea
            id="mitigation-description"
            className="form-input"
            value={mitigationDescription}
            onChange={(e) => setMitigationDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="resolution-description">
            How was the incident resolved?
          </label>
          <textarea
            id="resolution-description"
            className="form-input"
            value={resolutionDescription}
            onChange={(e) => setResolutionDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="severity">Severity</label>
          <select
            id="severity"
            className="form-input"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="">Select severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
        <label htmlFor="teams">Teams</label>
        <ReactSelect
            id="teams"
            isMulti
            options={teamOptions}
            value={teamOptions.filter((option) =>
            selectedTeams.includes(option.value)
            )}
            onChange={(selectedOptions) => {
            setSelectedTeams(selectedOptions.map((option) => option.value));
            }}
            classNamePrefix="react-select"
        />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            className="form-input"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default EditDataModal;
