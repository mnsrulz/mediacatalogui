import React, { useState, useEffect } from 'react';
import { MediaCardListComponent } from '../MediaCardList/MediaCardListComponent'
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

export const PlaylistDetails = ({ playlistId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const result = await apiClient.get(`playlists/${playlistId}/items`);
            setData(result.data);
            setLoading(false);
        })();
    }, [playlistId]);

    return (
        <div>
            <MediaCardListComponent items={data} isLoading={loading}></MediaCardListComponent>
        </div>
    );
};