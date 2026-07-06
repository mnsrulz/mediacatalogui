import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../ApiClient/MediaCatalogNetlifyClient';

export const FinalStep = ({ selectedFiles, parentUrl, title, year, mediaType, fileHeaders, accessToken }: FinalStepProps) => {
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [requestId, setRequestId] = useState();
    useEffect(() => {
        (async () => {
            const payload = {
                parentUrl,
                files: selectedFiles,
                title,
                year,
                mediaType,
                accessToken,
                rawUpload: true,
                fileUrlHeaders: fileHeaders
            };
            try {
                const response = await apiClient.post('remoteUrlUploadRequest', payload);
                setRequestId(response.data.id);
                setIsLoaded(true);
            } catch (e: { message: string } | any) {
                setError(e.message);
            }
        })();
    }, [selectedFiles]);

    if (error) {
        return <div>Error: {error}</div>;
    } else if (!isLoaded) {
        return <div>Submitting Request...</div>;
    } else {
        return <span>Success! <Button component={Link} to={`/remoteuploads/${requestId}`}>View Request</Button></span>;
    }
}

type FinalStepProps = {
    selectedFiles: { fileName: string, fileUrl: string, fileSize: number }[],
    parentUrl: string,
    title: string,
    year: string,
    mediaType: string,
    fileHeaders: Record<string, string>,
    accessToken: string
}