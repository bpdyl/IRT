import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Rich Text Editor
import 'react-quill/dist/quill.snow.css'; // Import styles
import axios from 'axios';

const PlaybookEditor = ({ playbookId }) => {
    const [playbookContent, setPlaybookContent] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        // Fetch playbook content from the backend
        axios.get(`/api/playbooks/${playbookId}/`)
            .then(response => {
                setPlaybookContent(response.data.content);
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

    return (
        <div>
            {editing ? (
                <ReactQuill value={playbookContent} onChange={setPlaybookContent} />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: playbookContent }} />
            )}
            <button onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit'}
            </button>
            {editing && <button onClick={handleSave}>Save</button>}
        </div>
    );
};

export default PlaybookEditor;
