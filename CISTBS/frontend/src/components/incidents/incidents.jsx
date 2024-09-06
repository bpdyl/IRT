import React, { useState } from 'react';
import IncidentCreateForm from './IncidentCreateForm'
import './incidents.css';

const Incidents = () => {
  const [incidents, setIncidents] = useState({
    inTriage: [],
    active: [],
    mitigated: [],
    resolved: [],
    cancelled: [],
  });

  const [isSectionOpen, setIsSectionOpen] = useState({
    inTriage: true,
    active: true,
    mitigated: true,
    resolved: true,
    cancelled: true,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

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
      <header>
        <h1>Incidents</h1>
        <div className="tabs">
          <button className="tab active">Live</button>
          <button className="tab">Test</button>
          <button className="tab">Maintenance</button>
        </div>
        <button className="report-button" onClick={handleButtonClick}>Create Incident</button>
      </header>
      {Object.keys(incidents).map((section, index) => (
        <div key={index} className="section">
          <div className="section-header" onClick={() => toggleSection(section)}>
            <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
            <span>{incidents[section].length}</span>
          </div>
          {isSectionOpen[section] && (
            <div className="section-content">
              {incidents[section].length > 0 ? (
                incidents[section].map((incident, i) => (
                  <div key={i} className="incident">
                    {incident}
                  </div>
                ))
              ) : (
                <p>No {section} incidents</p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Conditionally render the New Incident Form in a modal */}
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
