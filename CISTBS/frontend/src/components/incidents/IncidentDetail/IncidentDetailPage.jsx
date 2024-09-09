import React, { useState } from 'react';
import IncidentHeader from './IncidentHeader/IncidentHeader';
import IncidentTabs from './IncidentTabs/IncidentTabs';
import './IncidentDetailPage.scss';


const IncidentDetailPage = () => {
    const [activeTab, setActiveTab] = useState('Timeline');
    const [incident, setIncident] = useState({
        id: 2,
        title: 'favorite_items table has been dropped',
        description: 'DROP TABLE has been executed on production environment instead staging',
        status: 'Active',
        severity: 'SEV0',
        services: ['DB - Production Database'],
        teams: [],
        playbook: 'High Severity Playbook',
        startDate: 'Sep 1 at 7:33 PM',
        elapsedTime: '3d',
        systemEventsIncluded: false,
        updates: [
            { id: 1, user: 'Bibek Paudyal', content: 'Table is now up and 500 HTTP requests are decreasing', time: 'Sep 1 07:42:53 PM +0545' },
            { id: 2, user: 'Bibek Paudyal', content: 'Services has been added: DB - Production Database', time: 'Sep 1 07:33:53 PM +0545' },
        ]
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
      };

    return (
        <div className='incident-detail-page'>
            {/* <div className="style-0">
                <div className="style-1">
                    <div className="style-2">
                        <div className="style-3">
                            <div className="style-4"> */}
                                <IncidentHeader
                                    title={incident.title}
                                    description={incident.description}
                                    severity={incident.severity}
                                    startedAt={incident.startedAt}
                                    elapsedTime={incident.elapsedTime}
                                />
                           {/* </div> */}

                                <IncidentTabs activeTab={activeTab} onTabChange={handleTabChange} />
                                    {/* Content for the active tab will go here */}
                         {/* </div>
                     </div>
                 </div>
             </div> */}
        </div>
    );
};

export default IncidentDetailPage;
