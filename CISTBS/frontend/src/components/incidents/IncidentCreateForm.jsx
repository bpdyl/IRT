import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useIncidentService } from '../../services/incidentService';
import './IncidentCreateForm.css';

const IncidentCreateForm = ({ onClose }) => {
    const { fetchteamUsers, fetchTeams, fetchIncidentRoles , fetchSeverities, createSeverity, fetchIncidentTypes, createIncidentType, createIncident, createTeam } = useIncidentService();

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [severity, setSeverity] = useState('');
    const [incidentType, setIncidentType] = useState('');

    const [selectedTeams, setSelectedTeams] = useState([]); // Track selected teams

    const [deadlineDate, setDeadlineDate] = useState('');
    const [assignments, setAssignments] = useState([]);  // For role assignments

    const [teams, setTeams] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const [severityOptions, setSeverityOptions] = useState([]);
    const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
    const [rolesOptions, setRolesOptions] = useState([]);  // Assuming you have roles

    // Fetching initial data for dropdowns (teams, severity, users)
    useEffect(() => {
        fetchIncidentTypes().then((data) => {
            const options = data.map((type) => ({ value: type.id, label: type.name }));
            setIncidentTypeOptions(options);
        });
        fetchSeverities().then(setSeverityOptions); // Fetch severity choices from backend
        // Fetch available teams from backend
        fetchTeams().then((data)=>{
            const options = data.map((team) => ({ value: team.id, label: team.name }));
            setTeams(options);
        });
        fetchIncidentRoles().then((data) => {
            const options = data.map((role) => ({ value: role.id, label: role.name }));
            setRolesOptions(options);
        }); 
    }, []);

    // Fetch members based on selected teams
    useEffect(() => {
        if (selectedTeams.length > 0) {
            const selectedTeamIds = selectedTeams.map(team => team.value);
            console.log('Selected team IDs:', selectedTeamIds);
            fetchteamUsers(selectedTeamIds).then(setTeamMembers); // Fetch team members based on selected teams
        } else {
            setTeamMembers([]); // Clear team members when no teams are selected
        }
    }, [selectedTeams]);

     // Handle on-the-fly creation of incident types
     const handleCreateIncidentType = (inputValue) => {
        createIncidentType({ name: inputValue }).then((newType) => {
            const newOption = { value: newType.id, label: newType.name };
            setIncidentTypeOptions((prev) => [...prev, newOption]);
            setIncidentType(newOption);
        });
    };

    // Handle on-the-fly creation of severities
    const handleCreateSeverity = (inputValue) => {
        createSeverity({ value: inputValue, label: inputValue }).then((newSeverity) => {
            const newOption = { value: newSeverity.value, label: newSeverity.label };
            setSeverityOptions((prev) => [...prev, newOption]);
            setSeverity(newOption);
        });
    };
    
    // Handle the on-the-fly team creation
    const handleCreateTeam = async (newTeamName) => {
        try {
            const createdTeam = await createTeam(newTeamName);
            setTeams(prevTeams => [...prevTeams, { value: createdTeam.id, label: createdTeam.name }]);
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    // Handle adding a new assignment
    const addAssignment = () => {
        setAssignments([...assignments, { user: null, role: null }]);
    };

    // Handle assignment changes
    const handleAssignmentChange = (index, field, value) => {
        const newAssignments = [...assignments];
        newAssignments[index][field] = value;
        setAssignments(newAssignments);
    };

    // Remove an assignment
    const removeAssignment = (index) => {
        const newAssignments = [...assignments];
        newAssignments.splice(index, 1);
        setAssignments(newAssignments);
    };

      const handleSubmit = async (event) => {
        event.preventDefault();
      
        const newIncident = {
          title,
          summary,
          severity: severity ? severity.value : null,  // Extract value
          incident_type: incidentType ? incidentType.value : null,  // Extract value
          deadlineDate,
          teams: selectedTeams.map(team => team.value),  // Send team IDs
          assignments: assignments.map((assignment) => ({
            user: assignment.user ? assignment.user.value : null,
            role: assignment.role ? assignment.role.value : null,
        })),
        };

        console.log('New Incident:', newIncident);
      
        try {
          await createIncident(newIncident);
          onClose();  // Close the form on successful creation
        } catch (error) {
          console.error('Error creating incident:', error);
        }
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
            </div>

            <div className="form-group">
                <label htmlFor="summary">Summary</label>
                <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Briefly describe the incident"
                    className="form-textarea"
                ></textarea>
            </div>

            {/* Incident Type */}
            <div className="form-group">
                <label htmlFor="incident-type">Incident Type</label>
                <CreatableSelect
                    id="incident-type"
                    value={incidentType}
                    onChange={(selectedOption) => setIncidentType(selectedOption)}
                    onCreateOption={handleCreateIncidentType}
                    options={incidentTypeOptions}
                    classNamePrefix="select"
                    placeholder="Select or create incident type"
                />
            </div>

            {/* Severity */}
            <div className="form-group">
                <label htmlFor="severity">Severity</label>
                <CreatableSelect
                    id="severity"
                    value={severity}
                    onChange={(selectedOption) => setSeverity(selectedOption)}
                    onCreateOption={handleCreateSeverity}
                    options={severityOptions}
                    classNamePrefix="select"
                    placeholder="Select or create severity"
                />
            </div>

            {/* Assigning Multiple Teams */}
            <div className="form-group">
                <label htmlFor="teams">Teams</label>
                {/* Handle on-the-fly team creation */}
                <Select
                    isMulti
                    value={selectedTeams}
                    onChange={setSelectedTeams}
                    options={teams}
                    classNamePrefix="select"
                    placeholder="Select teams"
                    createOptionPosition="first"
                    isCreatable   // Add this to allow dynamic creation of options
                    onCreateOption={handleCreateTeam}  
                />

            </div>

            {/* Assign Roles from Team Members */}
            <div className="form-group assign-roles">
                <h3>Assign Roles</h3>
                {assignments.map((assignment, index) => (
                    <div key={index} className="assignment">
                        <Select
                            value={assignment.user}
                            onChange={(selectedOption) => handleAssignmentChange(index, 'user', selectedOption)}
                            options={teamMembers}
                            classNamePrefix="select"
                            placeholder="Select User"
                        />
                        <Select
                            value={assignment.role}
                            onChange={(selectedOption) => handleAssignmentChange(index, 'role', selectedOption)}
                            options={rolesOptions}
                            classNamePrefix="select"
                            placeholder="Select Role"
                        />
                        <button
                            type="button"
                            onClick={() => removeAssignment(index)}
                            className="btn-remove-assignment"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addAssignment} className="btn-add-assignment">
                    Add Assignment
                </button>
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
