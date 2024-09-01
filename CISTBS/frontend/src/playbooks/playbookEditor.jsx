import React, { useState, useEffect } from 'react';
import { useAuthFetch } from '../hooks/useAuthFetch'; 
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill'; // Rich Text Editor
import 'react-quill/dist/quill.snow.css'; // Import styles
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { REACT_APP_API_SERVER_URL } from '../config/constant';
// Import the custom SCSS file
import './playbook.scss';

const PlaybookEditor = ({ playbookId }) => {
    const [playbookContent, setPlaybookContent] = useState('');
    const [playbookTitle, setPlaybookTitle] = useState('');
    const [isEditable, setIsEditable] = useState(false);
    const [editing, setEditing] = useState(false);
    const authFetch = useAuthFetch(); // Use the custom hook
    const navigate = useNavigate();


    useEffect(() => {
        // Fetch playbook content from the backend using authFetch
        const fetchPlaybook = async () => {
            try {
                const data = await authFetch(`${REACT_APP_API_SERVER_URL}/api/playbooks/${playbookId}/`);
                setPlaybookContent(data.content);
                setPlaybookTitle(data.title);
                setIsEditable(data.is_editable);

            } catch (error) {
                console.error("Error fetching playbook:", error);
            }
        };

        fetchPlaybook();
    }, [playbookId]);

    const handleSave = async () => {
        try {
            await authFetch(`/api/playbooks/${playbookId}/update/`, {
                method: 'POST',
                data: { content: playbookContent },
            });
            setEditing(false);
            alert("Playbook saved successfully!");
        } catch (error) {
            console.error("Error saving playbook:", error);
        }
    };

    const handleMakeCopyAndEdit = async () => {
        try {
            const newPlaybook = await authFetch(`/api/playbooks/${playbookId}/copy/`, {
                method: 'POST',
            });
            alert("Playbook copy created successfully!");
            navigate(`/playbooks/${newPlaybook.id}`)
        } catch (error) {
            console.error("Error creating playbook copy:", error);
        }
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
