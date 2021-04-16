import React, { useEffect, useState } from 'react';
import { apiClient } from '../../ApiClient/MediaCatalogNetlifyClient';


export const FinalStep = ({ fileUrl, selectedFiles, parentUrl, title, year, mediaType }) => {
    const [error, setError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const accessToken = JSON.parse(localStorage.token).accessToken;
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
                accessToken
            };
            const response = await apiClient.post('remoteUrlUploadRequest', payload);            
            setIsLoaded(true);
        })()
    }, [selectedFiles, fileUrl]);
    
    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Submitting Request...</div>;
    } else {
        return <span>Success!</span>;
    }
}

// React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             error: null,
//             isLoaded: false,
//             data: [],
//             selectedFiles: props.selectedFiles,
//             zipFileUrl: props.zipFileUrl
//         };
//     }

//     async componentDidMount() {        
//         const files = this.state.selectedFiles.map(i => i.path);
//         const payload = {
//             fileUrl: this.state.zipFileUrl,
//             files
//         };
//         var headers = new Headers();
//         const idToken = JSON.parse(localStorage.token).tokenId;
//         headers.append('Authorization', 'Bearer ' + idToken);
//         headers.append("content-type", "application/json");
//         const apiUrl = 'https://mediacatalog.netlify.app/.netlify/functions/server/remoteUrlUploadRequest';
//         try {
//             const response = await fetch(apiUrl, { headers: headers, method: 'POST', body: JSON.stringify(payload) });
//             if (response.ok) {
//                 const tempdata = await response.json();

//                 this.setState({
//                     isLoaded: true,
//                     data: tempdata
//                 });
//             } else {
//                 throw Error(`Unexpected response code receieved ${response.status}`);
//             }
//         } catch (error) {
//             this.setState({
//                 error: error
//             });
//         }
//     }
//     render() {
//         const { error, isLoaded } = this.state;
//         if (error) {
//             return <div>Error: {error.message}</div>;
//         } else if (!isLoaded) {
//             return <div>Submitting Request...</div>;
//         } else {
//             return <span>Success!</span>;
//         }
//     }
// }