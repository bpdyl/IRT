import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './IncidentCreateForm.css';
import axios from 'axios';

const IncidentCreateForm = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [severity, setSeverity] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);

    // New state for date and time
    const [creationDateTime, setCreationDateTime] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');

    // State for role assignment
    const [commander, setCommander] = useState(null);
    const [communicator, setCommunicator] = useState(null);
    const [resolver, setResolver] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const severityOptions = [
        { value: 'sev0', label: 'SEV0', description: 'Critical system issue', color: '#FF3B30' },
        { value: 'sev1', label: 'SEV1', description: 'Significant impact where major functionality is impacted', color: '#FF9500' },
        { value: 'sev2', label: 'SEV2', description: 'Partial degradation or minor issues', color: '#FFCC00' },
    ];

    const typeOptions = [
        { value: 'default', label: 'Default' },
        { value: 'cloud', label: 'Cloud' },
        { value: 'customer-facing', label: 'Customer Facing' },
        { value: 'security', label: 'Security' },
    ];

    const roleOptions = [
        { value: 'User 1', label: 'Subin Timilsina' },
        { value: 'User 2', label: 'Sanjay Poudel' },
        { value: 'User 3', label: 'Gaurav Adhikari' },
        { value: 'User 4', label: 'Neeraj Das' },
        { value: 'User 5', label: 'Osama Mohomad' },
    ];

    useEffect(() => {
        if (title.length > 2) {
            axios.get(`http://localhost:8000/api/incidents/suggestions/?query=${title}`)
                .then(response => {
                    const filteredSuggestions = response.data.filter(suggestion =>
                        suggestion.toLowerCase().includes(title.toLowerCase())
                    );
                    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
                        const aIndex = a.toLowerCase().indexOf(title.toLowerCase());
                        const bIndex = b.toLowerCase().indexOf(title.toLowerCase());
                        return aIndex - bIndex;
                    });
                    setSuggestions(sortedSuggestions);
                    setShowSuggestions(true);
                })
                .catch(error => {
                    console.error('Error fetching incident suggestions:', error);
                });
        } else {
            setShowSuggestions(false);
        }
    }, [title]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log({
            title,
            summary,
            severity,
            selectedTypes,
            isPrivate,
            creationDateTime,
            commander,
            communicator,
            resolver,
            deadlineDate,
        });
        onClose();
    };

    const handleTypeChange = (selectedOptions) => {
        setSelectedTypes(selectedOptions);
    };

    const handleSuggestionClick = (suggestion) => {
        setTitle(suggestion);
        setShowSuggestions(false);
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
                    autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
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
                <label htmlFor="creation-date-time">Creation Date & Time</label>
                <input
                    type="datetime-local"
                    id="creation-date-time"
                    value={creationDateTime}
                    onChange={(e) => setCreationDateTime(e.target.value)}
                    className="form-input"
                />
            </div>

            

            {/* Assign Roles section */}
            <div className="form-group assign-roles">
                <h3>Assign Roles</h3>
                <div className="role-input">
                    <label htmlFor="commander">Commander</label>
                    <Select
                        value={commander}
                        onChange={(selectedOption) => setCommander(selectedOption)}
                        options={roleOptions}
                        classNamePrefix="select"
                        placeholder="Assign Commander"
                    />
                </div>

                <div className="role-input">
                    <label htmlFor="communicator">Communicator</label>
                    <Select
                        value={communicator}
                        onChange={(selectedOption) => setCommunicator(selectedOption)}
                        options={roleOptions}
                        classNamePrefix="select"
                        placeholder="Assign Communicator"
                    />
                </div>

                <div className="role-input">
                    <label htmlFor="resolver">Resolver</label>
                    <Select
                        value={resolver}
                        onChange={(selectedOption) => setResolver(selectedOption)}
                        options={roleOptions}
                        classNamePrefix="select"
                        placeholder="Assign Resolver"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="deadline-date">Deadline Date</label>
                <input
                    type="date"
                    id="deadline-date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="form-input"
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit">Create Incident</button>
            </div>
        </form>
    );
};

export default IncidentCreateForm;
