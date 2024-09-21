// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation
// import IncidentCreateForm from './IncidentCreateForm';
// import { useIncidentService } from '../../services/incidentService';
// import './incidents.scss';

// const Incidents = () => {
//   const [incidents, setIncidents] = useState({
//     active: [],
//     mitigated: [],
//     resolved: [],
//     cancelled: [],
//   });

//   const [isSectionOpen, setIsSectionOpen] = useState({
//     active: true,
//     mitigated: true,
//     resolved: true,
//     cancelled: true,
//   });

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const { fetchIncidents } = useIncidentService();

//   // Fetch incidents from API on component mount
//   useEffect(() => {
//     const loadIncidents = async () => {
//       try {
//         const response = await fetchIncidents();
//         const groupedIncidents = {
//           active: [],
//           mitigated: [],
//           resolved: [],
//           cancelled: [],
//         };

//         // Categorize incidents based on their status
//         response.forEach(incident => {
//           switch (incident.status) {
//             case 'Identified':
//               groupedIncidents.active.push(incident);
//               break;
//             case 'Investigating':
//             case 'Mitigated':
//               groupedIncidents.mitigated.push(incident);
//               break;
//             case 'Resolved':
//               groupedIncidents.resolved.push(incident);
//               break;
//             case 'Closed':
//               groupedIncidents.cancelled.push(incident);
//               break;
//             default:
//               groupedIncidents.active.push(incident);
//               break;
//           }
//         });
//         setIncidents(groupedIncidents);
//       } catch (error) {
//         console.error('Failed to load incidents:', error);
//       }
//     };

//     loadIncidents();
//   }, []);

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
//       <header className="incident-header">
//         <h1>Incidents</h1>
//         <button className="report-button" onClick={handleButtonClick}>
//           Create Incident
//         </button>
//       </header>

//       {Object.keys(incidents).map((section, index) => (
//         <div key={index} className="section">
//           <div className="section-header" onClick={() => toggleSection(section)}>
//             <span className="section-title">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
//             <span className="incident-count">({incidents[section].length})</span>
//           </div>
//           {isSectionOpen[section] && (
//             <div className="section-content">
//               {incidents[section].length > 0 ? (
//                 incidents[section].map((incident, i) => (
//                   <Link 
//                     to={`/incidents/${incident.id}`}  // Create a clickable link to the incident detail page
//                     key={i} 
//                     className="incident-link"
//                   >
//                     <div className="incident">
//                       <div className="incident-header">
//                         <div className="incident-title">
//                           <span>{incident.title}</span>
//                         </div>
                        
//                         <div className="incident-details">
//                         <span className={`severity-pill ${incident.severity.toLowerCase()}`}>{incident.severity}</span>
//                           <span>Started: {new Date(incident.reported_date).toLocaleString()}</span>
//                           <span className="incident-description">{incident.description}</span>
//                         </div>
//                       </div>
//                       <div className="incident-footer">
//                         <div className="incident-roles">
//                           {console.log('Asisgnments: '+incident.assignments.length)}
//                           {incident.assignments && incident.assignments.length > 0 ? (
//                             <div className="roles-assigned">
//                               <span>{incident.assignments.length} Assigned Roles</span>
//                               <div className="role-badges">
//                                 {incident.assignments.map((role, idx) => (
//                                   <span key={idx} className="roles-badge">
//                                     {role.user ? role.user.name.charAt(0) : "?"}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           ) : (
//                             <span>No roles assigned</span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))
//               ) : (
//                 <p>No {section} incidents</p>
//               )}
//             </div>
//           )}
//         </div>
//       ))}

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
import { Link } from 'react-router-dom';
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
            case 'Investigating':
              groupedIncidents.active.push(incident);
              break;
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
            <span className="section-title">
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
            <span className="incident-count">({incidents[section].length})</span>
            <span className="toggle-icon">
              {isSectionOpen[section] ? '▲' : '▼'}
            </span>
          </div>
          {isSectionOpen[section] && (
            <div className="section-content">
              {incidents[section].length > 0 ? (
                incidents[section].map((incident, i) => (
                  <Link
                    to={`/incidents/${incident.id}`}
                    key={i}
                    className="incident-link"
                  >
                    <div className="incident-card">
                      <div className="incident-card-header">
                        <div className="incident-title">
                          {incident.title}
                        </div>
                        <div className={`severity-badge ${incident.severity.toLowerCase()}`}>
                          {incident.severity}
                        </div>
                      </div>
                      <div className="incident-card-body">
                        <p className="incident-description">
                          {incident.description}
                        </p>
                        <div className="incident-details">
                          <span className="detail-item">
                            <strong>Started:</strong>{' '}
                            {new Date(incident.reported_date).toLocaleString()}
                          </span>
                          <span className="detail-item">
                            <strong>Status:</strong> {incident.status}
                          </span>
                        </div>
                      </div>
                      <div className="incident-card-footer">
                        {incident.assignments && incident.assignments.length > 0 ? (
                          <div className="assigned-roles">
                            <span className="roles-count">
                              {incident.assignments.length} Assigned Roles
                            </span>
                            <div className="role-badges">
                              {incident.assignments.map((role, idx) => (
                                <span key={idx} className="role-badge">
                                  {role.user
                                    ? role.user
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                    : '?'}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="no-roles">No roles assigned</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="no-incidents">No {section} incidents</p>
              )}
            </div>
          )}
        </div>
      ))}

      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseForm}>
              &times;
            </span>
            <IncidentCreateForm onClose={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;

