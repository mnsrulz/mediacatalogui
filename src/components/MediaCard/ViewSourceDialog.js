import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";
import DeleteIcon from '@material-ui/icons/Delete';
import { Link, useParams } from 'react-router-dom';

export const ViewSourceDialog = ({ open, mediaId, onClose }) => {
    
    const theme = useTheme();
    const [sources, setSources] = useState([]);

    useEffect(() => {
        if (open) {
            (async () => {
                const allPlaylist = await apiClient.get(`items/${mediaId}/mediasources`);
                setSources(allPlaylist.data);
            })();
        }
    }, [open, mediaId]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>Sources...</DialogTitle>
            <DialogContent dividers>
                {
                    sources && (<List>
                        {sources.map((value) => {
                            const labelId = `checkbox-list-label-${value.id}`;
                            console.log('value is ', value);
                            return (<ListItem key={value.id} component={Link} to={`/explorer/${value.id}`}>
                                <ListItemText id={labelId} primary={value.renderedTitle} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => alert('not implemented...')}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>)
                        })}
                    </List>)
                }
            </DialogContent>
        </Dialog>
    );
}