// import React, { useState, useEffect } from 'react';
// import ReactQuill from 'react-quill'; // Rich Text Editor
// import 'react-quill/dist/quill.snow.css'; // Import styles
// import axios from 'axios';

// const PlaybookEditor = ({ playbookId }) => {
//     const [playbookContent, setPlaybookContent] = useState('');
//     const [editing, setEditing] = useState(false);

//     useEffect(() => {
//         // Fetch playbook content from the backend
//         axios.get(`/api/playbooks/${playbookId}/`)
//             .then(response => {
//                 setPlaybookContent(response.data.content);
//             })
//             .catch(error => {
//                 console.error("Error fetching playbook:", error);
//             });
//     }, [playbookId]);

//     const handleSave = () => {
//         axios.post(`/api/playbooks/${playbookId}/update/`, { content: playbookContent })
//             .then(response => {
//                 setEditing(false);
//                 alert("Playbook saved successfully!");
//             })
//             .catch(error => {
//                 console.error("Error saving playbook:", error);
//             });
//     };

//     return (
//         <div>
//             {editing ? (
//                 <ReactQuill value={playbookContent} onChange={setPlaybookContent} />
//             ) : (
//                 <div dangerouslySetInnerHTML={{ __html: playbookContent }} />
//             )}
//             <button onClick={() => setEditing(!editing)}>
//                 {editing ? 'Cancel' : 'Edit'}
//             </button>
//             {editing && <button onClick={handleSave}>Save</button>}
//         </div>
//     );
// };

// export default PlaybookEditor;
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Rich Text Editor
import 'react-quill/dist/quill.snow.css'; // Import styles
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

// Import the custom SCSS file
import './playbook.scss';

const PlaybookEditor = ({ playbookId }) => {
    const [playbookContent, setPlaybookContent] = useState('');
    const [playbookTitle, setPlaybookTitle] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        // Fetch playbook content from the backend
        axios.get(`/api/playbooks/${playbookId}/`)
            .then(response => {
                setPlaybookContent(response.data.content);
                setPlaybookTitle(response.data.title);
                console.log('Playbook editable: ', response.data.is_editable);
                setIsEditable(response.data.is_editable);
            })
            .catch(error => {
                console.error("Error fetching playbook:", error);
            });
    }, [playbookId]);

    const handleSave = () => {
        axios.post(`/api/playbooks/${playbookId}/update/`, { content: playbookContent })
            .then(response => {
                setEditing(false);
                alert("Playbook saved successfully!");
            })
            .catch(error => {
                console.error("Error saving playbook:", error);
            });
    };

    const handleMakeCopyAndEdit = () => {
        axios.post(`/api/playbooks/${playbookId}/copy/`)
            .then(response => {
                alert("Playbook copy created successfully!");
                window.location.reload(); // Reload the page to load the copied playbook
            })
            .catch(error => {
                console.error("Error creating playbook copy:", error);
            });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>{playbookTitle}</h3>
                {isEditable ? (
                    <button onClick={() => setEditing(!editing)}>
                        {editing ? 'Cancel' : 'Edit'}
                    </button>
                ) : (
                    <button onClick={handleMakeCopyAndEdit}>
                        Make a Copy and Edit
                    </button>
                )}
            </div>
            <div className="card-block">
                {editing ? (
                    <ReactQuill value={playbookContent} onChange={setPlaybookContent} />
                ) : (
                    <ReactMarkdown className="markdown" children={playbookContent} remarkPlugins={[remarkGfm]} />
                )}
                {editing && <button onClick={handleSave}>Save</button>}
            </div>
        </div>
    );
};

export default PlaybookEditor;

