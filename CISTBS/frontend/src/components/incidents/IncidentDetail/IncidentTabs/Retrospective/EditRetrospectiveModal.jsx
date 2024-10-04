// // EditRetrospectiveModal.jsx

// import React, { useState, useEffect } from 'react';
// import Modal from '../../../../../views/ui-elements/Modal/Modal';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
// import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';

// import './EditRetrospectiveModal.scss';

// const EditRetrospectiveModal = ({
//   isOpen,
//   onClose,
//   onSave,
//   initialContent = '',
//   initialTemplateId = null,
// }) => {
//   const [templates, setTemplates] = useState([]);
//   const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
//   const [content, setContent] = useState(initialContent);

//   const authFetch = useAuthFetch();

//   // Fetch templates on component mount
//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const response = await authFetch(
//           `${REACT_APP_API_SERVER_URL}/api/retrospective-templates/`
//         );
//         setTemplates(response);
//       } catch (error) {
//         console.error('Failed to fetch templates:', error);
//       }
//     };

//     fetchTemplates();
//   }, [isOpen]);

//   // Handle template selection change
//   const handleTemplateChange = (e) => {
//     const templateId = e.target.value;
//     setSelectedTemplateId(templateId);

//     // Find the selected template and set its content
//     const selectedTemplate = templates.find(
//       (template) => template.id === parseInt(templateId)
//     );
//     if (selectedTemplate) {
//       setContent(selectedTemplate.content);
//     } else {
//       setContent('');
//     }
//   };

//   const handleSave = () => {
//     // Pass the content and selected template ID back to the parent component
//     onSave({ content, templateId: selectedTemplateId });
//     onClose();
//   };

//   const footer = (
//     <>
//       <button className="cancel-button" onClick={onClose}>
//         Cancel
//       </button>
//       <button className="save-button" onClick={handleSave}>
//         Save
//       </button>
//     </>
//   );

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Edit Retrospective Document"
//       footer={footer}
//     >
//       <div className="modal-body edit-retrospective-modal">
//         <div className="form-group">
//           <label htmlFor="template">Select Template</label>
//           <select
//             id="template"
//             className="form-input"
//             value={selectedTemplateId || ''}
//             onChange={handleTemplateChange}
//           >
//             <option value="">-- Choose a Template --</option>
//             {templates.map((template) => (
//               <option key={template.id} value={template.id}>
//                 {template.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label htmlFor="content">Content</label>
//           <ReactQuill
//             value={content}
//             onChange={setContent}
//             theme="snow"
//             className="rich-text-editor"
//           />
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditRetrospectiveModal;
// EditRetrospectiveModal.jsx

// EditRetrospectiveModal.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../../../../../views/ui-elements/Modal/Modal';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';
import DOMPurify from 'dompurify';

import './EditRetrospectiveModal.scss';

const EditRetrospectiveModal = ({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
  initialTemplateId = null,
}) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId);
  const [content, setContent] = useState(initialContent);

  const authFetch = useAuthFetch();

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await authFetch(
          `${REACT_APP_API_SERVER_URL}/api/retrospective-templates/`
        );
        setTemplates(response);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, [isOpen]);

  // Function to convert HTML to Delta
  const htmlToDelta = (html) => {
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.clipboard.dangerouslyPasteHTML(html);
    const delta = tempQuill.getContents();
    return delta;
  };

  // Handle template selection change
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);

    // Find the selected template and set its content
    const selectedTemplate = templates.find(
      (template) => template.id === parseInt(templateId)
    );
    if (selectedTemplate) {
      // Sanitize HTML content
      const sanitizedHtml = DOMPurify.sanitize(selectedTemplate.content);

      // Convert HTML to Delta
      const deltaContent = htmlToDelta(sanitizedHtml);
      setContent(deltaContent);
    } else {
      setContent('');
    }
  };

  const handleSave = () => {
    // Pass the content and selected template ID back to the parent component
    onSave({ content, templateId: selectedTemplateId });
    onClose();
  };

  const footer = (
    <>
      <button className="cancel-button" onClick={onClose}>
        Cancel
      </button>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Retrospective Document"
      footer={footer}
    >
      <div className="modal-body edit-retrospective-modal">
        <div className="form-group">
          <label htmlFor="template">Select Template</label>
          <select
            id="template"
            className="form-input"
            value={selectedTemplateId || ''}
            onChange={handleTemplateChange}
          >
            <option value="">-- Choose a Template --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            className="rich-text-editor"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditRetrospectiveModal;


