import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../ApiClient/MediaCatalogNetlifyClient';

export const FinalStep = ({ fileUrl, selectedFiles, parentUrl, title, year, mediaType, rawUpload, fileHeaders }: FinalStepProps) => {
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const accessToken = JSON.parse(localStorage.token).accessToken;
    const [requestId, setRequestId] = useState();
    useEffect(() => {
        (async () => {
            const files = selectedFiles.map(i => i.path);
            const payload = {
                fileUrl,
                parentUrl,
                files,
                title,
                year,
                mediaType,
                accessToken,
                rawUpload,
                fileUrlHeaders: fileHeaders
            };
            try {
                const response = await apiClient.post('remoteUrlUploadRequest', payload);
                setRequestId(response.data.id);
                setIsLoaded(true);
            } catch (e) {
                setError(e.message);
            }
        })();
    }, [selectedFiles, fileUrl]);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Submitting Request...</div>;
    } else {
        return <span>Success! <Button component={Link} to={`/remoteuploads/${requestId}`}>View Request</Button></span>;
    }
}

type FinalStepProps = {
    fileUrl: string, 
    selectedFiles: { path: string }[],
    parentUrl: string, title: string
    , year: string,
    mediaType: string, rawUpload: boolean, fileHeaders: Record<string, string>
}