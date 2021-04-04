import React, { useEffect, useState } from 'react';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';

import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, List, ListItem, ListItemText, ListSubheader, Paper, Typography } from '@material-ui/core';

const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    navlink: {
        textDecoration: 'none',
        '& :visited': {
            color: 'red'
        }
    }, breadcrumb: {
        marginBottom: theme.spacing(1),
    },
    paper: {
        // padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}));



export const Playlist = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        (async () => {
            const response = await apiClient.get('/playlists');
            // setRows(response.data);
            setRows([...response.data, ...[{ title: 'Hdhub', id: 'hdhub' }, { title: 'Extramovies', id: 'extramovies' }]]);
            setIsLoading(false);
        })();
    }, []);

    return <div>
        <Breadcrumbs className={classes.breadcrumb}>
            <Typography>Playlist</Typography>
        </Breadcrumbs>
        <Paper className={classes.paper}>
            <List component="nav" className={classes.root} aria-label="Playlist">
                {
                    isLoading ? <div>Loading...</div> :
                        rows?.map(({ id, title, ts }) => {
                            return <ListItem key={id} button component={Link} to={`/playlistdetails/${id}`}>
                                <ListItemText primary={title}
                                    secondary={dayjs(ts).fromNow()}
                                />
                            </ListItem>
                        })
                }
            </List>
        </Paper>

    </div>
}