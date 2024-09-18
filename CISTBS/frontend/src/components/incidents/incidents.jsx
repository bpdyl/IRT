// import React, { useState } from 'react';
// import IncidentCreateForm from './IncidentCreateForm'
// import './incidents.css';

// const Incidents = () => {
//   const [incidents, setIncidents] = useState({
//     inTriage: [],
//     active: [],
//     mitigated: [],
//     resolved: [],
//     cancelled: [],
//   });

//   const [isSectionOpen, setIsSectionOpen] = useState({
//     inTriage: true,
//     active: true,
//     mitigated: true,
//     resolved: true,
//     cancelled: true,
//   });

//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const toggleSection = (section) => {
//     setIsSectionOpen({
//       ...isSectionOpen,
//       [section]: !isSectionOpen[section],
//     });
//   };

//   const handleButtonClick = () => {
//     setIsFormOpen(true);
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//   };

//   return (
//     <div className="incident-dashboard">
//       <header>
//         <h1>Incidents</h1>
//         <div className="tabs">
//           <button className="tab active">Live</button>
//           <button className="tab">Test</button>
//           <button className="tab">Maintenance</button>
//         </div>
//         <button className="report-button" onClick={handleButtonClick}>Create Incident</button>
//       </header>
//       {Object.keys(incidents).map((section, index) => (
//         <div key={index} className="section">
//           <div className="section-header" onClick={() => toggleSection(section)}>
//             <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
//             <span>{incidents[section].length}</span>
//           </div>
//           {isSectionOpen[section] && (
//             <div className="section-content">
//               {incidents[section].length > 0 ? (
//                 incidents[section].map((incident, i) => (
//                   <div key={i} className="incident">
//                     {incident}
//                   </div>
//                 ))
//               ) : (
//                 <p>No {section} incidents</p>
//               )}
//             </div>
//           )}
//         </div>
//       ))}

//       {/* Conditionally render the New Incident Form in a modal */}
//       {isFormOpen && (
//         <div className="modal">
//           <div className="modal-content">
//             <span className="close-button" onClick={handleCloseForm}>&times;</span>
//             <IncidentCreateForm onClose={handleCloseForm} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Incidents;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import IncidentCreateForm from './IncidentCreateForm';
import { useIncidentService } from '../../services/incidentService';
import './incidents.scss';

const Incidents = () => {
  const [incidents, setIncidents] = useState({
    active: [],
    mitigated: [],
    resolved: [],
    cancelled: [],
  });

  const [isSectionOpen, setIsSectionOpen] = useState({
    active: true,
    mitigated: true,
    resolved: true,
    cancelled: true,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const { fetchIncidents } = useIncidentService();

  // Fetch incidents from API on component mount
  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const response = await fetchIncidents();
        const groupedIncidents = {
          active: [],
          mitigated: [],
          resolved: [],
          cancelled: [],
        };

        // Categorize incidents based on their status
        response.forEach(incident => {
          switch (incident.status) {
            case 'Identified':
              groupedIncidents.active.push(incident);
              break;
            case 'Investigating':
            case 'Mitigated':
              groupedIncidents.mitigated.push(incident);
              break;
            case 'Resolved':
              groupedIncidents.resolved.push(incident);
              break;
            case 'Closed':
              groupedIncidents.cancelled.push(incident);
              break;
            default:
              groupedIncidents.active.push(incident);
              break;
          }
        });
        setIncidents(groupedIncidents);
      } catch (error) {
        console.error('Failed to load incidents:', error);
      }
    };

    loadIncidents();
  }, []);

  const toggleSection = (section) => {
    setIsSectionOpen({
      ...isSectionOpen,
      [section]: !isSectionOpen[section],
    });
  };

  const handleButtonClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="incident-dashboard">
      <header className="incident-header">
        <h1>Incidents</h1>
        <button className="report-button" onClick={handleButtonClick}>
          Create Incident
        </button>
      </header>

      {Object.keys(incidents).map((section, index) => (
        <div key={index} className="section">
          <div className="section-header" onClick={() => toggleSection(section)}>
            <span className="section-title">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
            <span className="incident-count">({incidents[section].length})</span>
          </div>
          {isSectionOpen[section] && (
            <div className="section-content">
              {incidents[section].length > 0 ? (
                incidents[section].map((incident, i) => (
                  <Link 
                    to={`/incidents/${incident.id}`}  // Create a clickable link to the incident detail page
                    key={i} 
                    className="incident-link"
                  >
                    <div className="incident">
                      <div className="incident-header">
                        <div className="incident-title">
                          <span>{incident.title}</span>
                        </div>
                        <div className="incident-details">
                          <span className="severity-pill">{incident.severity}</span>
                          <span>Started: {new Date(incident.reported_date).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="incident-footer">
                        <div className="incident-roles">
                          {incident.assignments && incident.assignments.length > 0 ? (
                            <div className="roles-assigned">
                              <span>{incident.assignments.length} Assigned Roles</span>
                              <div className="role-badges">
                                {incident.assignments.map((role, idx) => (
                                  <span key={idx} className="roles-badge">
                                    {role.user ? role.user.name.charAt(0) : "?"}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span>No roles assigned</span>
                          )}
                        </div>
                        <button className="assign-roles-button">Assign Roles</button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No {section} incidents</p>
              )}
            </div>
          )}
        </div>
      ))}

      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseForm}>&times;</span>
            <IncidentCreateForm onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;


