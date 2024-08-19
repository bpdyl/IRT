// src/playbooks/PlaybookDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import PlaybookEditor from './playbookEditor';

const PlaybookDetail = () => {
    const { playbookId } = useParams();

    return (
            <PlaybookEditor playbookId={playbookId} />
    );
};

export default PlaybookDetail;
