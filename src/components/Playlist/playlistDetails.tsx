import React, { useState, useEffect } from 'react';
import { MediaCardListComponent } from '../MediaCardList/MediaCardListComponent'
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";
import { Breadcrumbs, Typography, makeStyles, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    breadcrumb: {
        marginBottom: theme.spacing(3),
    },
}));


export const PlaylistDetails = ({ playlistId }:PlaylistDetailsProps) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();
    const [title, setTitle] = useState('');

    useEffect(() => {
        (async () => {
            setLoading(true);
            if (['extramovies', 'hdhub'].includes(playlistId)) {
                setTitle(playlistId);
            } else {
                const playlistDetails = await apiClient.get(`playlists/${playlistId}`);
                setTitle(playlistDetails.data.title);
            }
            const result = await apiClient.get(`playlists/${playlistId}/items?pageSize=100`);
            setData(result.data.items);
            setLoading(false);
        })();
    }, [playlistId]);

    return (
        <div>
            <Breadcrumbs className={classes.breadcrumb}>
                {/* <Link color="primary" to='/playlist'>Playlists</Link> */}
                <Button color='primary' component={Link} to='/playlist'>Playlists</Button>
                <Typography>{title}</Typography>
            </Breadcrumbs>
            <MediaCardListComponent items={data} isLoading={loading} playlistIdentifier={playlistId} ></MediaCardListComponent>
        </div>
    );
};

type PlaylistDetailsProps = {
    playlistId:string
}