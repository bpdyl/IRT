// // IncidentHeader.jsx
// import React, { useState } from 'react';
// import './IncidentHeader.scss';

// const IncidentHeader = ({
//   status,
//   title,
//   description,
//   onUpdateTitle,
//   onUpdateDescription,
// }) => {
//   const [isEditingTitle, setIsEditingTitle] = useState(false);
//   const [newTitle, setNewTitle] = useState(title);
//   const [isEditingDescription, setIsEditingDescription] = useState(false);
//   const [newDescription, setNewDescription] = useState(description);

//   // Handlers for updating the title
//   const handleTitleSubmit = (event) => {
//     event.preventDefault();
//     onUpdateTitle(newTitle);
//     setIsEditingTitle(false);
//   };

//   // Handlers for updating the description
//   const handleDescriptionSubmit = (event) => {
//     event.preventDefault();
//     onUpdateDescription(newDescription);
//     setIsEditingDescription(false);
//   };

//   // Status Indicator Component
//   const IncidentStatus = ({ status }) => {
//     const statusClass = status === 'Active' ? 'style-6' : 'style-inactive';
//     return (
//       <div className="style-5">
//         <span className={statusClass} title={status}>
//           <svg
//             className="style-7"
//             part="ninja-icon"
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill={status === 'Active' ? '#C73C40' : '#CCCCCC'}
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle cx="9" cy="9" r="5" className="style-8"></circle>
//           </svg>
//           <span className="style-9">{status}</span>
//         </span>
//       </div>
//     );
//   };

//   return (
//     <div className="incident-header">
//       {/* Status */}
//       <IncidentStatus status={status} />

//       {/* Title */}
//       <div className="style-10">
//         {!isEditingTitle ? (
//           <span className="style-11" onClick={() => setIsEditingTitle(true)}>
//             {title}
//           </span>
//         ) : (
//           <form className="style-12" onSubmit={handleTitleSubmit}>
//             <input
//               type="text"
//               className="style-15"
//               value={newTitle}
//               onChange={(e) => setNewTitle(e.target.value)}
//               autoFocus
//             />
//             <div className="style-16">
//               <button
//                 type="reset"
//                 className="style-17"
//                 onClick={() => setIsEditingTitle(false)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="style-18"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//               <button className="style-21" type="submit">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="style-22"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       {/* Description */}
//       <div className="style-29">
//         {!isEditingDescription ? (
//           <div className="style-30" onClick={() => setIsEditingDescription(true)}>
//             <div className="style-31">
//               <p className="style-33">{description}</p>
//             </div>
//           </div>
//         ) : (
//           <form className="style-41" onSubmit={handleDescriptionSubmit}>
//             <textarea
//               className="style-45"
//               value={newDescription}
//               onChange={(e) => setNewDescription(e.target.value)}
//               autoFocus
//             />
//             <div className="style-46">
//               <button
//                 type="reset"
//                 className="style-47"
//                 onClick={() => setIsEditingDescription(false)}
//               >
//                 Cancel
//               </button>
//               <button className="style-51" type="submit">
//                 Save
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default IncidentHeader;
import React from 'react';
import './IncidentHeader.scss';  // You can define your styles here

const IncidentHeader = () => {
  return (
    <div className="incident-header">
      {/* Status */}
      <div className="status">
        <span className="status-badge active">Active</span>
        <span className="incident-title">favorite_items table has been dropped</span>
        <span className="incident-id">#2 Example</span>
      </div>
      
      {/* Description */}
      <div className="description">
        <p>
          DROP TABLE has been executed on production environment instead of staging. Lorem Ipsum is simply dummy text of the printing and typesetting industry...
        </p>
      </div>
      {/* Action Button */}
      <div className="action-buttons">
        <button className="action-button">View Retrospective</button>
        <button className="action-button">Edit Integrations</button>
        <button className="action-button">Assign Roles</button>
    </div>
    </div>
  );
};

export default IncidentHeader;
