import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from 'react-router-dom';  // Import hooks from react-router-dom
import { fetchIncident } from '../../../redux/reducer/incidentSlice';
import { useIncidentService } from '../../../services/incidentService';
import IncidentHeader from './IncidentHeader/IncidentHeader';
import IncidentTabs from './IncidentTabs/IncidentTabs';
import './IncidentDetailPage.scss';

const IncidentDetailPage = ({ incidentId: propIncidentId }) => {
    const incident = useSelector((state) => state.incident);  // Get incident state from Redux
    const dispatch = useDispatch();
    const { incidentId: urlIncidentId } = useParams();  // Get incidentId from the URL if available
    const incidentId = propIncidentId || urlIncidentId;  // Use the prop incidentId or fallback to the URL param
    const { updateIncidentTitle, updateIncidentDescription } = useIncidentService();  // Get service methods

    const location = useLocation();  // Access the current URL location
    const navigate = useNavigate();  // To change the URL programmatically

    const getTabFromUrl = () => {
        const params = new URLSearchParams(location.search);  // Parse the query parameters
        console.log('Params: ', params);
        return params.get('tab') || 'Timeline';  // Default to 'Timeline' if no tab is specified
    };
    const [activeTab, setActiveTab] = useState(getTabFromUrl());  // Initialize tab from URL


    // Fetch incident details when the component mounts
    useEffect(() => {
        if (incidentId) {
            dispatch(fetchIncident(incidentId));  // Dispatch Redux action to fetch the incident
        }
    }, [incidentId, dispatch]);

     // Ensure tab state is synced with URL after the page loads
     useEffect(() => {
        const tabFromUrl = getTabFromUrl();
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);  // Set tab from URL query
        }
    }, [location.search]);  // Watch for changes in the query string

    // Sync tab changes with the URL
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`?tab=${tab}`);  // Update the URL with the selected tab as a query parameter
    };

    // Handle saving title
    const handleSaveTitle = async (newTitle) => {
        try {
            await updateIncidentTitle(incident.id, newTitle);
            dispatch({ type: 'incident/updateIncidentTitle', payload: newTitle });
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    // Handle saving description
    const handleSaveDescription = async (newDescription) => {
        try {
            await updateIncidentDescription(incident.id, newDescription);
            dispatch({ type: 'incident/updateIncidentDescription', payload: newDescription });
        } catch (error) {
            console.error('Error updating description:', error);
        }
    };

    // If loading, show spinner
    if (incident.loading) {
        return <Spinner animation="border" variant="primary" className="d-block mx-auto my-4" />;
    }

    // If error occurs, show alert
    if (incident.error) {
        return <Alert variant="danger" className="my-4 text-center">{incident.error}</Alert>;
    }

    if (!incident.id) {
        return <div>No incident found.</div>;
    }

    return (
        <div className='incident-detail-page'>
            {/* Incident Header with Redux actions */}
            <IncidentHeader
                title={incident.title}
                description={incident.description}
                status={incident.status}
                incidentId={incident.id}
                onSaveTitle={handleSaveTitle}
                onSaveDescription={handleSaveDescription}
            />

            <IncidentTabs activeTab={activeTab} onTabChange={handleTabChange} incidentId={incidentId} />
        </div>
    );
};

export default IncidentDetailPage;
