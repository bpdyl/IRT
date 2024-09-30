import React from 'react';
import './IncidentTabs.scss';
import Timeline from './Timeline/Timeline';  
import Tasks from './Tasks/Tasks';
import FollowUps from './FollowUps/FollowUps';
import Retrospective from './Retrospective/Retrospective';

const IncidentTabs = ({ activeTab, onTabChange, incident }) => {
  const tabs = ['Timeline', 'Tasks', 'Follow-ups', 'Retrospective'];
  console.log('Incident: ', incident);
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}  // Call parent handler to change tab and update the URL
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="tabs-content">
        {activeTab === 'Timeline' && <Timeline incidentId={incident.id} />}
        {activeTab === 'Tasks' && <Tasks incidentId={incident.id} />}
        {activeTab === 'Follow-ups' && <FollowUps incidentId={incident.id} />}
        {activeTab === 'Retrospective' && <Retrospective incidentId={incident.id}/>}
      </div>
    </div>
  );
};

export default IncidentTabs;


