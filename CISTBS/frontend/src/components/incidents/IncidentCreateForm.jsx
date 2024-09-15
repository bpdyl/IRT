import React, { useState, useEffect } from 'react';  // <-- Added useEffect for fetching suggestions
import Select from 'react-select';
import './IncidentCreateForm.css';
import axios from 'axios';  // <-- Added axios to make requests to the backend

const IncidentCreateForm = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [severity, setSeverity] = useState('');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    
    const [suggestions, setSuggestions] = useState([]);  // <-- Added state for storing suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);  // <-- Control when to show the suggestions

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

    // Fetch suggestions based on user input
    useEffect(() => {
        if (title.length > 2) {  // Fetch suggestions when the user has typed at least 3 characters
            axios.get(`http://localhost:8000/api/incidents/suggestions/?query=${title}`)  // <-- Backend API for suggestions
                .then(response => {
                    // Filter and sort suggestions
                    const filteredSuggestions = response.data.filter(suggestion =>
                        suggestion.toLowerCase().includes(title.toLowerCase())
                    );
                    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
                        const aIndex = a.toLowerCase().indexOf(title.toLowerCase());
                        const bIndex = b.toLowerCase().indexOf(title.toLowerCase());
                        return aIndex - bIndex;  // Prioritize suggestions where input is found earlier
                    });
                    setSuggestions(sortedSuggestions);  // Set the filtered and sorted suggestions
                    setShowSuggestions(true);  // Show the suggestions dropdown
                    
                })
                .catch(error => {
                    console.error('Error fetching incident suggestions:', error);
                });
        } else {
            setShowSuggestions(false);  // Hide suggestions if input is less than 3 characters
        }
    }, [title]);  // <-- Trigger this effect when 'title' changes

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

    // Handle selecting a suggestion from the dropdown
    const handleSuggestionClick = (suggestion) => {
        setTitle(suggestion);  // Set the selected suggestion as the title
        setShowSuggestions(false);  // Hide the suggestions dropdown
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
                {/* Suggestions dropdown */}
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


            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit">Create Incident</button>
            </div>
        </form>
    );
};

export default IncidentCreateForm;
