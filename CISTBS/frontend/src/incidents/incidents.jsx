import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './incidents.css'; // Import the CSS file for styling
import logo from './ausdias.png';

const Incidents = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleButtonClick = () => {
    navigate('/IRS'); // Redirect to the desired route when the button is clicked
  };

  return (
    <div className="container">
      <div className="background-image" style={{ backgroundImage: `url(${logo})` }}></div>
      <div className="content">
        <p className="description">
          If you encounter any issues or need to report a new incident, please use the button below.
        </p>
        <button className="report-button" onClick={handleButtonClick}>
          Report a new incident
        </button>
      </div>
    </div>
  );
};

export default Incidents;

// import React from 'react';
// import './IRS.css'; // Import the CSS file for styling
// import logo from './ausdias.png'
// const incidents = () => {
//   return (
//     <div className="container">
//         <div className="background-image" style={{backgroundImage: `url(${logo})`}}></div>
//         <div className="content">
//             <p className="description">
//                 If you encounter any issues or need to report a new incident, please use the button below.
//         </p>
//         <button className="report-button">Report a new incident</button>
//       </div>
//     </div>
//   );
// };
// export default incidents;

// THIS ONE STARTS FROM HERE
// import React, { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import axios from "axios";
// import MUIDataTable from "mui-datatables";
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Typography,
//   Container,
//   MenuItem,
// } from "@mui/material";
// import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import jsPDF from 'jspdf';
//
// const Incidents = () => {
//   const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
//   const [incidents, setIncidents] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [newIncident, setNewIncident] = useState({
//     incident_name: "",
//     date_of_incident: null,
//     incident_priority: "",
//     time_of_occurrence: null,
//     time_of_resolution: null,
//     incident_type: "",
//     personnel_involved: "",
//     incident_impact: "",
//     brief_summary: ""
//   });
//   const [errors, setErrors] = useState({});
//   const [selectedIncident, setSelectedIncident] = useState(null);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
//
//   useEffect(() => {
//     if (isAuthenticated) {
//       axios.get("/api/incidents/")
//         .then(response => {
//           setIncidents(response.data);
//         })
//         .catch(error => {
//           console.error("There was an error fetching the incidents!", error);
//         });
//     }
//   }, [isAuthenticated]);
//
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewIncident({ ...newIncident, [name]: value });
//   };
//
//   const handleDateChange = (name, value) => {
//     setNewIncident({ ...newIncident, [name]: value });
//   };
//
//   const validateForm = () => {
//     const newErrors = {};
//     Object.keys(newIncident).forEach(key => {
//       if (key !== 'time_of_resolution' && (!newIncident[key] || newIncident[key] === null)) {
//         newErrors[key] = `${key.replace(/_/g, ' ')} is required`;
//       }
//     });
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//
//   const handleCreateIncident = () => {
//     if (validateForm()) {
//       const formattedIncident = {
//         ...newIncident,
//         date_of_incident: dayjs(newIncident.date_of_incident).format('YYYY-MM-DD'),
//         time_of_occurrence: dayjs(newIncident.time_of_occurrence).format('HH:mm:ss'),
//         time_of_resolution: newIncident.time_of_resolution ? dayjs(newIncident.time_of_resolution).format('HH:mm:ss') : null
//       };
//
//       axios.post("/api/incidents/", formattedIncident)
//         .then(response => {
//           setIncidents([...incidents, response.data]);
//           setOpen(false);
//           setNewIncident({
//             incident_name: "",
//             date_of_incident: null,
//             incident_priority: "",
//             time_of_occurrence: null,
//             time_of_resolution: null,
//             incident_type: "",
//             personnel_involved: "",
//             incident_impact: "",
//             brief_summary: ""
//           });
//         })
//         .catch(error => {
//           console.error("There was an error creating the incident!", error.response.data);
//         });
//     }
//   };
//
//   const downloadPDF = () => {
//     if (selectedIncident) {
//       const doc = new jsPDF();
//       doc.setFontSize(12);
//       doc.text(`Incident Name: ${selectedIncident.incident_name}`, 10, 20);
//       doc.text(`Date of Incident: ${selectedIncident.date_of_incident}`, 10, 30);
//       doc.text(`Incident Priority: ${selectedIncident.incident_priority}`, 10, 40);
//       doc.text(`Time of Occurrence: ${selectedIncident.time_of_occurrence}`, 10, 50);
//       doc.text(`Time of Resolution: ${selectedIncident.time_of_resolution || 'Not resolved yet'}`, 10, 60);
//       doc.text(`Incident Type: ${selectedIncident.incident_type}`, 10, 70);
//       doc.text(`Personnel Involved: ${selectedIncident.personnel_involved}`, 10, 80);
//       doc.text(`Incident Impact: ${selectedIncident.incident_impact}`, 10, 90);
//       doc.text(`Brief Summary: ${selectedIncident.brief_summary}`, 10, 100);
//       doc.save(`incident_${selectedIncident.incident_name}.pdf`);
//     }
//   };
//
//   const columns = [
//     { name: "incident_name", label: "Incident Name" },
//     { name: "date_of_incident", label: "Date of Incident" },
//     { name: "incident_priority", label: "Incident Priority" },
//     { name: "time_of_occurrence", label: "Time of Occurrence" },
//     { name: "time_of_resolution", label: "Time of Resolution" },
//     { name: "incident_type", label: "Incident Type" },
//     { name: "personnel_involved", label: "Personnel Involved" },
//     { name: "incident_impact", label: "Incident Impact" },
//     { name: "brief_summary", label: "Brief Summary" }
//   ];
//
//   const options = {
//     filter: true,
//     filterType: 'dropdown',
//     responsive: 'standard',
//     search: true,
//     searchPlaceholder: 'Search Incident Name',
//     selectableRows: 'none',
//     customSearch: (searchQuery, currentRow, columns) => {
//       return currentRow[0].toLowerCase().includes(searchQuery.toLowerCase());
//     },
//     onRowClick: (rowData, rowMeta) => {
//       setSelectedIncident(incidents[rowMeta.dataIndex]);
//       setDetailDialogOpen(true);
//     }
//   };
//
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Container>
//         <AppBar position="static">
//           <Toolbar>
//             <Typography variant="h6" style={{ flexGrow: 1, textAlign: "center" }}>
//               Company Logo
//             </Typography>
//             {isAuthenticated ? (
//               <>
//                 <Typography variant="body1" style={{ marginRight: 16 }}>
//                   {user.name}
//                 </Typography>
//                 <Button color="inherit" onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
//               </>
//             ) : (
//               <Button color="inherit" onClick={() => loginWithRedirect()}>Login</Button>
//             )}
//           </Toolbar>
//         </AppBar>
//         <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginTop: 20 }}>
//           Create New Incident
//         </Button>
//         <MUIDataTable
//           title={"Incidents"}
//           data={incidents}
//           columns={columns}
//           options={options}
//         />
//         <Dialog open={open} onClose={() => setOpen(false)}>
//           <DialogTitle>Create New Incident</DialogTitle>
//           <DialogContent>
//             <TextField
//               margin="dense"
//               name="incident_name"
//               label="Incident Name"
//               fullWidth
//               value={newIncident.incident_name}
//               onChange={handleInputChange}
//               error={!!errors.incident_name}
//               helperText={errors.incident_name}
//             />
//             <DatePicker
//               label="Date of Incident"
//               value={newIncident.date_of_incident}
//               onChange={(date) => handleDateChange("date_of_incident", date)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   margin="dense"
//                   fullWidth
//                   error={!!errors.date_of_incident}
//                   helperText={errors.date_of_incident}
//                 />
//               )}
//               inputFormat="YYYY-MM-DD"
//             />
//             <TextField
//               margin="dense"
//               name="incident_priority"
//               label="Incident Priority"
//               fullWidth
//               select
//               value={newIncident.incident_priority}
//               onChange={handleInputChange}
//               error={!!errors.incident_priority}
//               helperText={errors.incident_priority}
//             >
//               <MenuItem value="High">High</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="Low">Low</MenuItem>
//             </TextField>
//             <TimePicker
//               label="Time of Occurrence"
//               value={newIncident.time_of_occurrence}
//               onChange={(time) => handleDateChange("time_of_occurrence", time)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   margin="dense"
//                   fullWidth
//                   error={!!errors.time_of_occurrence}
//                   helperText={errors.time_of_occurrence}
//                 />
//               )}
//             />
//             <TimePicker
//               label="Time of Resolution"
//               value={newIncident.time_of_resolution}
//               onChange={(time) => handleDateChange("time_of_resolution", time)}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   margin="dense"
//                   fullWidth
//                   error={!!errors.time_of_resolution}
//                   helperText={errors.time_of_resolution}
//                 />
//               )}
//             />
//             <TextField
//               margin="dense"
//               name="incident_type"
//               label="Incident Type"
//               fullWidth
//               value={newIncident.incident_type}
//               onChange={handleInputChange}
//               error={!!errors.incident_type}
//               helperText={errors.incident_type}
//             />
//             <TextField
//               margin="dense"
//               name="personnel_involved"
//               label="Personnel Involved"
//               fullWidth
//               value={newIncident.personnel_involved}
//               onChange={handleInputChange}
//               error={!!errors.personnel_involved}
//               helperText={errors.personnel_involved}
//             />
//             <TextField
//               margin="dense"
//               name="incident_impact"
//               label="Incident Impact"
//               fullWidth
//               value={newIncident.incident_impact}
//               onChange={handleInputChange}
//               error={!!errors.incident_impact}
//               helperText={errors.incident_impact}
//             />
//             <TextField
//               margin="dense"
//               name="brief_summary"
//               label="Brief Summary"
//               fullWidth
//               value={newIncident.brief_summary}
//               onChange={handleInputChange}
//               error={!!errors.brief_summary}
//               helperText={errors.brief_summary}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpen(false)} color="primary">
//               Cancel
//             </Button>
//             <Button onClick={handleCreateIncident} color="primary">
//               Create
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)}>
//           <DialogTitle>Incident Details</DialogTitle>
//           <DialogContent>
//             {selectedIncident && (
//               <>
//                 <Typography variant="h6">Incident Name: {selectedIncident.incident_name}</Typography>
//                 <Typography>Date of Incident: {selectedIncident.date_of_incident}</Typography>
//                 <Typography>Incident Priority: {selectedIncident.incident_priority}</Typography>
//                 <Typography>Time of Occurrence: {selectedIncident.time_of_occurrence}</Typography>
//                 <Typography>Time of Resolution: {selectedIncident.time_of_resolution || 'Not resolved yet'}</Typography>
//                 <Typography>Incident Type: {selectedIncident.incident_type}</Typography>
//                 <Typography>Personnel Involved: {selectedIncident.personnel_involved}</Typography>
//                 <Typography>Incident Impact: {selectedIncident.incident_impact}</Typography>
//                 <Typography>Brief Summary: {selectedIncident.brief_summary}</Typography>
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDetailDialogOpen(false)} color="primary">Close</Button>
//             <Button onClick={downloadPDF} color="primary">Download PDF</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </LocalizationProvider>
//   );
// };
//
// export default Incidents;