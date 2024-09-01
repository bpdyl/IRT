// src/playbooks/PlaybookList.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { REACT_APP_API_SERVER_URL } from '../config/constant';
import { useAuthFetch } from '../hooks/useAuthFetch';

// Helper component to display playbook rows
const PlaybookRow = ({ playbook, onClick }) => {
    const truncateDescription = (description, maxLength = 100) => {
        if (description.length > maxLength) {
            return `${description.substring(0, maxLength)}...`;
        }
        return description;
    };

    return (
        <tr
            key={playbook.id}
            className="unread"
            onClick={() => onClick(playbook.id)}
            style={{ cursor: 'pointer' }}
        >
            <td>
                <h6 className="mb-1">{playbook.title}</h6>
            </td>
            <td>
                <p className="m-0">{truncateDescription(playbook.description)}</p>
            </td>
            <td>
                <h6 className="text-muted">
                    <i className="fa fa-circle text-c-green f-10 m-r-15" />
                    {new Date(playbook.updated_at).toLocaleDateString()} {/* Format date nicely */}
                </h6>
            </td>
        </tr>
    );
};

const PlaybookList = () => {
    const [playbooks, setPlaybooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authFetch = useAuthFetch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaybooks = async () => {
            try {
                const data = await authFetch(`${REACT_APP_API_SERVER_URL}/api/playbooks`);
                setPlaybooks(data);
            } catch (error) {
                console.error("Error fetching playbooks:", error);
                setError("Failed to load playbooks. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaybooks();
    }, []);

    const handleRowClick = (playbookId) => {
        navigate(`/playbooks/${playbookId}`);
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" className="d-block mx-auto my-4" />;
    }

    if (error) {
        return <Alert variant="danger" className="my-4 text-center">{error}</Alert>;
    }

    return (
        <Row>
            <Col sm={12}>
                <Card className="Recent-Users widget-focus-lg">
                    <Card.Header>
                        <Card.Title as="h5">Playbooks</Card.Title>
                    </Card.Header>
                    <Card.Body className="px-0 py-2">
                        <Table responsive hover className="recent-users">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Last Modified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playbooks.map(playbook => (
                                    <PlaybookRow
                                        key={playbook.id}
                                        playbook={playbook}
                                        onClick={handleRowClick}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default PlaybookList;
