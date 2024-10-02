// RetrospectiveReport.jsx

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchIncident } from '../../../../../redux/reducer/incidentSlice';
import { useParams } from 'react-router-dom';
import Timeline from '../Timeline/Timeline';
import './RetrospectiveReport.scss';
import DOMPurify from 'dompurify';
import html2pdf from 'html2pdf.js/dist/html2pdf';

const RetrospectiveReport = () => {
  const { incidentId } = useParams();
  const dispatch = useDispatch();

  const { incident, retrospective } = useSelector((state) => state.incident);

  const reportRef = useRef(null);

  useEffect(() => {
    dispatch(fetchIncident(incidentId));
  }, [dispatch, incidentId]);

    // Function to handle PDF generation
    const handleDownloadPDF = () => {
        const element = reportRef.current;
        const opt = {
          margin:       0.5,
          filename:     `Incident_Retrospective_Report_${incidentId}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        // Hide the Download button before generating PDF
        const downloadButton = document.getElementById('download-button');
        if (downloadButton) {
          downloadButton.style.display = 'none';
        }
    
        html2pdf().from(element).set(opt).save().then(() => {
          // Restore the Download button after generating PDF
          if (downloadButton) {
            downloadButton.style.display = 'block';
          }
        });
      };

  // Function to render the content with placeholders replaced
  const renderContent = () => {
    const template = retrospective.content || '';
    const context = { incident, retrospective };

    return template.replace(/{{\s*([\w\.]+)\s*}}/g, (_, path) => {
      const keys = path.split('.');
      return keys.reduce((obj, key) => (obj ? obj[key] : ''), context) || '';
    });
  };

  // Handle cases where incident or retrospective data might not be available yet
  if (!incident || !retrospective) {
    return <div>Loading...</div>;
  }

  return (
    <div className="retrospective-report" ref={reportRef}>
         {/* Download PDF Button */}
      <div className="download-button-container">
        <button id="download-button" className="download-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
      <h1 className="report-title">Incident Retrospective Report</h1>

      {/* Incident Details Section */}
      <section className="incident-details">
        <h2>Incident Details</h2>
        <div className="details-grid">
          <div>
            <strong>Title:</strong> {incident.title}
          </div>
          <div>
            <strong>Description:</strong> {incident.description}
          </div>
          <div>
            <strong>Start Date & Time:</strong>{' '}
            {new Date(incident.start_datetime).toLocaleString()}
          </div>
          <div>
            <strong>Reported Date:</strong>{' '}
            {new Date(incident.reported_date).toLocaleString()}
          </div>
          <div>
            <strong>Mitigation Date & Time:</strong>{' '}
            {incident.mitigation_datetime
              ? new Date(incident.mitigation_datetime).toLocaleString()
              : 'N/A'}
          </div>
          <div>
            <strong>Resolution Date & Time:</strong>{' '}
            {incident.resolution_datetime
              ? new Date(incident.resolution_datetime).toLocaleString()
              : 'N/A'}
          </div>
          <div>
            <strong>Mitigation Description:</strong>{' '}
            {incident.mitigation_description || 'N/A'}
          </div>
          <div>
            <strong>Resolution Description:</strong>{' '}
            {incident.resolution_description || 'N/A'}
          </div>
          <div>
            <strong>Severity:</strong> {incident.severity}
          </div>
          <div>
            <strong>Teams Involved:</strong>{' '}
            {incident.team_ids && incident.team_ids.length > 0
              ? incident.team_ids.join(', ')
              : 'N/A'}
          </div>
          <div>
            <strong>Incident Type:</strong> {incident.incident_type || 'N/A'}
          </div>
        </div>
      </section>

      {/* Retrospective Document Section */}
      <section className="retrospective-content">
        <h2>Retrospective Document</h2>
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderContent()),
          }}
        />
      </section>

      {/* Timeline Events Section */}
      <section className="timeline-section">
        <h2>Timeline of Events</h2>
        <Timeline
          incidentId={incidentId}
          showPagination={false}
          showCommentToggle={false}
          enableScroll={false} // Disable internal scrolling
        />
      </section>
    </div>
  );
};

export default RetrospectiveReport;

// RetrospectiveReport.jsx

// import React, { useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchIncident } from '../../../../../redux/reducer/incidentSlice';
// import { useParams } from 'react-router-dom';
// import Timeline from '../Timeline/Timeline';
// import './RetrospectiveReport.scss';
// import DOMPurify from 'dompurify';
// import html2pdf from 'html2pdf.js';

// const RetrospectiveReport = () => {
//   const { incidentId } = useParams();
//   const dispatch = useDispatch();

//   const { incident, retrospective } = useSelector((state) => state.incident);

//   const reportRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchIncident(incidentId));
//   }, [dispatch, incidentId]);

//   // Function to render the content with placeholders replaced
//   const renderContent = () => {
//     const template = retrospective.content || '';
//     const context = { incident, retrospective };

//     return template.replace(/{{\s*([\w\.]+)\s*}}/g, (_, path) => {
//       const keys = path.split('.');
//       return keys.reduce((obj, key) => (obj ? obj[key] : ''), context) || '';
//     });
//   };

//   // Handle cases where incident or retrospective data might not be available yet
//   if (!incident || !retrospective) {
//     return <div>Loading...</div>;
//   }

//   // Function to handle PDF generation
//   const handleDownloadPDF = () => {
//     const element = reportRef.current;
//     const opt = {
//       margin:       0.5,
//       filename:     `Incident_Retrospective_Report_${incidentId}.pdf`,
//       image:        { type: 'jpeg', quality: 0.98 },
//       html2canvas:  { scale: 2 },
//       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
//     };

//     // Hide the Download button before generating PDF
//     const downloadButton = document.getElementById('download-button');
//     if (downloadButton) {
//       downloadButton.style.display = 'none';
//     }

//     html2pdf().from(element).set(opt).save().then(() => {
//       // Restore the Download button after generating PDF
//       if (downloadButton) {
//         downloadButton.style.display = 'block';
//       }
//     });
//   };

//   return (
//     <div className="retrospective-report" ref={reportRef}>
    //   {/* Download PDF Button */}
    //   <div className="download-button-container">
    //     <button id="download-button" className="download-button" onClick={handleDownloadPDF}>
    //       Download PDF
    //     </button>
    //   </div>

//       <h1 className="report-title">Incident Retrospective Report</h1>

//       {/* Incident Details Section */}
//       <section className="incident-details">
//         <h2>Incident Details</h2>
//         <div className="details-grid">
//           {/* Display incident details as per your requirement */}
//           <div>
//             <strong>Title:</strong> {incident.title}
//           </div>
//           {/* ... Include other incident details here ... */}
//         </div>
//       </section>

//       {/* Retrospective Document Section */}
//       <section className="retrospective-content">
//         <h2>Retrospective Document</h2>
//         <div
//           className="content"
//           dangerouslySetInnerHTML={{
//             __html: DOMPurify.sanitize(renderContent()),
//           }}
//         />
//       </section>

//       {/* Timeline Events Section */}
//       <section className="timeline-section">
//         <h2>Timeline of Events</h2>
//         <Timeline
//           incidentId={incidentId}
//           showPagination={false}
//           showCommentToggle={false}
//           enableScroll={false} // Disable scroll in the report
//         />
//       </section>
//     </div>
//   );
// };

// export default RetrospectiveReport;
