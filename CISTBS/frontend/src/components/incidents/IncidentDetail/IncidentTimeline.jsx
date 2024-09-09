import React from 'react';

const IncidentTimeline = ({ updates }) => {
    return (
        <div className="incident-timeline">
            <h3>Timeline</h3>
            <div className="timeline-events">
                {updates.map(update => (
                    <div key={update.id} className="timeline-event">
                        <span className="event-user">{update.user}</span> shared an update:
                        <p>{update.content}</p>
                        <span className="event-time">{update.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncidentTimeline;
