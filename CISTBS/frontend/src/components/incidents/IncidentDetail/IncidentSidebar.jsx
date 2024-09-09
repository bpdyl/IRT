import React from 'react';

const IncidentSidebar = ({ incident }) => {
    return (
        <div className="incident-sidebar">
            <div className="sidebar-section">
                <h4>Services</h4>
                {incident.services.map(service => (
                    <span key={service} className="service">{service}</span>
                ))}
            </div>
            <div className="sidebar-section">
                <h4>Playbooks</h4>
                <span>{incident.playbook}</span>
            </div>
            <div className="sidebar-section">
                <h4>Alerts</h4>
                <button className="btn">Attach</button>
            </div>
            <div className="sidebar-section">
                <h4>Workflows</h4>
                <ul>
                    <li>Total: 0</li>
                    <li>Queued: 0</li>
                    <li>Cancelled: 0</li>
                    <li>Completed: 0</li>
                    <li>Failed: 0</li>
                </ul>
            </div>
        </div>
    );
};

export default IncidentSidebar;
