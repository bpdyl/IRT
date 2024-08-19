// src/playbooks/PlaybookList.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PlaybookList = () => {
    const [playbooks, setPlaybooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/playbooks/')
            .then(response => {
                setPlaybooks(response.data);
            })
            .catch(error => {
                console.error("Error fetching playbooks:", error);
            });
    }, []);

    const truncateDescription = (description, maxLength = 100) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    const handleRowClick = (playbookId) => {
        navigate(`/playbooks/${playbookId}`);
    };

    return (
        <React.Fragment>
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
                                        <tr key={playbook.id} className="unread" onClick={() => handleRowClick(playbook.id)} style={{ cursor: 'pointer' }}>
                                            <td>
                                                <h6 className="mb-1">{playbook.title}</h6>
                                            </td>
                                            <td>
                                                <p className="m-0">{truncateDescription(playbook.description)}</p>
                                            </td>
                                            <td>
                                                <h6 className="text-muted">
                                                    <i className="fa fa-circle text-c-green f-10 m-r-15" />
                                                    {playbook.updated_at}
                                                </h6>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PlaybookList;
