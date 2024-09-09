import React, { useState } from 'react';
import Select from 'react-select';
import './IncidentCreateForm.css';

const IncidentCreateForm = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [severity, setSeverity] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);

    const severityOptions = [
        { value: 'sev0', label: 'SEV0', description: 'Critical system issue', color: '#FF3B30' },
        { value: 'sev1', label: 'SEV1', description: 'Significant impact where major functionality is impacted', color: '#FF9500' },
        { value: 'sev2', label: 'SEV2', description: 'Partial degradation or minor issues', color: '#FFCC00' },
        // Add more options as needed
    ];

    const typeOptions = [
        { value: 'default', label: 'Default' },
        { value: 'cloud', label: 'Cloud' },
        { value: 'customer-facing', label: 'Customer Facing' },
        { value: 'security', label: 'Security' },
    ];

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log({
            title,
            summary,
            severity,
            selectedTypes,
            isPrivate,
        });
        onClose(); // Close the form after submission
    };

    const handleTypeChange = (selectedOptions) => {
        setSelectedTypes(selectedOptions);
    };

    return (
        <form onSubmit={handleSubmit} className="incident-form">
            <h2 className="form-title">New Incident Details</h2>

            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter incident title"
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="summary">Summary</label>
                <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Briefly describe the impact of the incident"
                    className="form-textarea"
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="severity">Severity</label>
                <select
                    id="severity"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="form-select"
                >
                    {severityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <p className="severity-description">
                    {severityOptions.find((opt) => opt.value === severity)?.description}
                </p>
            </div>

            <div className="form-group">
                <label htmlFor="types">Types</label>
                <Select
                    isMulti
                    value={selectedTypes}
                    onChange={handleTypeChange}
                    options={typeOptions}
                    classNamePrefix="select"
                    placeholder="Select incident types"
                />
            </div>

            <div className="form-group">
                <label className="form-switch-label">
                    Is this a Private incident?
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="form-switch-input"
                    />
                </label>
                <p className="form-helper-text">
                    Private incidents such as security vulnerabilities will create a private Slack channel and only be accessible to users with private incident permissions.
                </p>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit">Create Incident</button>
            </div>
        </form>
    );
};

export default IncidentCreateForm;

