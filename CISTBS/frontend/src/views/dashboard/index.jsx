import React, { useEffect, useRef } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';

// Registering components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  Filler
);

// Sample Data
const incidentData = {
  overview: {
    totalIncidents: 150,
    incidentTypes: {
      'Security Breach': 30,
      'Hardware Failure': 25,
      'Software Issue': 40,
      'Network Issue': 20,
      'Other': 35,
    },
    statusDistribution: {
      open: 50,
      inProgress: 40,
      resolved: 30,
      closed: 30,
    },
    priorityLevels: {
      low: 20,
      medium: 50,
      high: 60,
      critical: 20,
    },
    incidentsOpenedVsResolved: {
      opened: 150,
      resolved: 130,
    },
  },
  trends: {
    incidentsOverTime: [10, 20, 15, 30, 50],
    resolutionTimes: [5, 10, 15, 10, 8],
  },
  criticalIncidents: [
    { date: '2024-09-01', critical: 5, high: 10, medium: 15, low: 20 },
    { date: '2024-09-02', critical: 3, high: 8, medium: 10, low: 12 },
    { date: '2024-09-03', critical: 7, high: 12, medium: 20, low: 15 },
    { date: '2024-09-04', critical: 4, high: 11, medium: 18, low: 10 },
    { date: '2024-09-05', critical: 6, high: 14, medium: 22, low: 17 },
  ],
};

// Chart Data Preparation
const incidentTypesData = {
  labels: Object.keys(incidentData.overview.incidentTypes),
  datasets: [
    {
      label: 'Incident Types',
      data: Object.values(incidentData.overview.incidentTypes),
      backgroundColor: [
        '#36A2EB',
        '#FF6384',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
      ],
    },
  ],
};

const statusData = {
  labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
  datasets: [
    {
      label: 'Incident Status',
      data: Object.values(incidentData.overview.statusDistribution),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    },
  ],
};

const trendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Incidents Over Time',
      data: incidentData.trends.incidentsOverTime,
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: true,
    },
    {
      label: 'Resolution Times (hrs)',
      data: incidentData.trends.resolutionTimes,
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: true,
    },
  ],
};

// Critical Incident Timeline Data
const timelineData = {
  labels: incidentData.criticalIncidents.map((incident) => incident.date),
  datasets: [
    {
      label: 'Critical',
      data: incidentData.criticalIncidents.map((incident) => incident.critical),
      borderColor: '#FF0000',
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      fill: true,
    },
    {
      label: 'High',
      data: incidentData.criticalIncidents.map((incident) => incident.high),
      borderColor: '#FFA500',
      backgroundColor: 'rgba(255, 165, 0, 0.3)',
      fill: true,
    },
    {
      label: 'Medium',
      data: incidentData.criticalIncidents.map((incident) => incident.medium),
      borderColor: '#FFFF00',
      backgroundColor: 'rgba(255, 255, 0, 0.3)',
      fill: true,
    },
    {
      label: 'Low',
      data: incidentData.criticalIncidents.map((incident) => incident.low),
      borderColor: '#008000',
      backgroundColor: 'rgba(0, 128, 0, 0.3)',
      fill: true,
    },
  ],
};

const Dashboard = () => {
  return (
    <React.Fragment>
      <Row>
        {/* Incident Overview */}
        <Col xl={4} lg={6}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Incident Overview</h6>
              <p>Total Incidents: {incidentData.overview.totalIncidents}</p>
              <Doughnut data={incidentTypesData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Incident Status Distribution */}
        <Col xl={4} lg={6}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Incident Status Distribution</h6>
              <Doughnut data={statusData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Incident Trends */}
        <Col xl={4} lg={12}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Incident Trends</h6>
              <Line data={trendData} />
            </Card.Body>
          </Card>
        </Col>

        {/* Critical Incident Timeline */}
        <Col xl={12}>
          <Card>
            <Card.Body>
              <h6 className="mb-4">Critical Incidents Timeline</h6>
              <Line data={timelineData} />
              <Table striped bordered hover className="mt-4">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Critical</th>
                    <th>High</th>
                    <th>Medium</th>
                    <th>Low</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentData.criticalIncidents.map((incident, index) => (
                    <tr key={index}>
                      <td>{incident.date}</td>
                      <td>{incident.critical}</td>
                      <td>{incident.high}</td>
                      <td>{incident.medium}</td>
                      <td>{incident.low}</td>
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

export default Dashboard;
