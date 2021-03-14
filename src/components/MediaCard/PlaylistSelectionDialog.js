import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, Checkbox, FormGroup, FormControlLabel, FormControl } from '@material-ui/core';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

export default function PlaylistSelectionDialog({ open, mediaId, selectedPlaylist, onClose }) {
    const theme = useTheme();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (open) {
            (async () => {
                const allPlaylist = await apiClient.get('playlists');
                setPlaylists(allPlaylist.data);
            })();
        }
    }, [open]);
    const [checked, setChecked] = React.useState(selectedPlaylist);

    const handleToggle = (value) => async () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        const resource = `items/${mediaId}/playlists/${value}`;
        if (currentIndex === -1) {
            newChecked.push(value);
            setChecked(newChecked);
            await apiClient.put(resource);
        } else {
            newChecked.splice(currentIndex, 1);
            setChecked(newChecked);
            await apiClient.delete(resource);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='sm'
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>Playlist...</DialogTitle>
            <DialogContent style={{ width: 240 }} dividers>
                <FormControl>
                    <FormGroup>
                        {playlists.map((value) => {
                            return (
                                <FormControlLabel
                                    control={<Checkbox checked={checked.indexOf(value.id) !== -1}
                                        onChange={handleToggle(value.id)}
                                        color='primary'
                                        name={value.id} />}
                                    label={value.title}
                                />
                            );
                        })}
                    </FormGroup>
                </FormControl>                
            </DialogContent>
        </Dialog>
    );
}