// // IncidentTabs.jsx
// import React from 'react';
// import './IncidentTabs.scss';

// const IncidentTabs = ({ activeTab, onTabChange }) => {
//   const tabs = ['Timeline', 'Tasks', 'Follow-ups', 'Status Page', 'Retrospective'];

//   return (
//     <div className="incident-tabs">
//       <ul>
//         {tabs.map((tab) => (
//           <li
//             key={tab}
//             className={activeTab === tab ? 'active' : ''}
//             onClick={() => onTabChange(tab)}
//           >
//             {tab}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default IncidentTabs;

import React from 'react';
import './IncidentTabs.scss';
import Timeline from './Timeline/Timeline';  // Importing the Timeline component
import Tasks from './Tasks/Tasks';
import FollowUps from './FollowUps/FollowUps';

const IncidentTabs = ({ activeTab, onTabChange, incidentId }) => {
  const tabs = ['Timeline', 'Tasks', 'Follow-ups', 'Status Page', 'Retrospective'];

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
        {activeTab === 'Timeline' && <Timeline incidentId={incidentId} />}
        {activeTab === 'Tasks' && <Tasks incidentId={incidentId} />}
        {activeTab === 'Follow-ups' && <FollowUps incidentId={incidentId} />}
        {activeTab === 'Status Page' && <div>Status Page Content</div>}
        {activeTab === 'Retrospective' && <div>Retrospective Content</div>}
      </div>
    </div>
  );
};

export default IncidentTabs;


