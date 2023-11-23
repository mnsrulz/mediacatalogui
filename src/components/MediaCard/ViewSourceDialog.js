import React, { useState } from 'react';
import { DialogContentText, FormGroup, FormControlLabel, Checkbox, Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, useMediaQuery } from '@material-ui/core';
import { SourceExplorer } from './SourceExplorer';
import { useTheme } from '@material-ui/core/styles';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh'
    },
    dialogContent: {
        paddingLeft: 0,
        paddingRight: 0
    }
}));

export const ViewSourceDialog = ({ open, mediaId, rootTitle, onClose }) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('xs'));

    if (open) {
        return (<Dialog
            fullScreen={fullScreenDialog}
            open={open}
            onClose={onClose}
            fullWidth={true}
            classes={{ paper: !fullScreenDialog && classes.dialogPaper }}
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>Sources...</DialogTitle>
            <DialogContent dividers classes={{ root: classes.dialogContent }}>
                <SourceExplorer mediaId={mediaId} rootTitle={rootTitle} />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
        );
    } else {
        return <div></div>
    }
}

export const ViewExternalIdDialog = ({ open, mediaId, rootTitle, tmdbId, imdbId, onClose }) => {
    const classes = useStyles();
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('xs'));
    const [imdbIdValue, setImdbIdValue] = useState('');
    const handleImdbIdValueChange = (ev) => setImdbIdValue(ev.target.value);
    const assignImdbId = async () => {
        if (imdbIdValue) {
            await apiClient.put(`items/${mediaId}/externalIds/${imdbIdValue}?type=imdb`);
            onClose();
        } else {
            alert('please enter imdb id to save.')
        }
    };

    const imdbOpener = imdbId ? <span>
        Imdb: {imdbId}
    </span> : <span>Imdb: <input onChange={handleImdbIdValueChange} /></span>;

    if (open) {
        return (<Dialog
            fullScreen={fullScreenDialog}
            open={open}
            onClose={onClose}
            fullWidth={true}
            classes={{ paper: !fullScreenDialog && classes.dialogPaper }}
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>{rootTitle} : External Sources</DialogTitle>
            <DialogContent dividers>
                Tmdb: {tmdbId}
                <br />
                {imdbOpener}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>Cancel</Button>
                <Button color="primary" onClick={assignImdbId}>Save ImdbId</Button>
            </DialogActions>
        </Dialog>
        );
    } else {
        return <div></div>
    }
}


export const RefreshMediaSourcesDialog = ({ open, mediaId, onClose }) => {
    const theme = useTheme();
    const fullScreenDialog = useMediaQuery(theme.breakpoints.down('xs'));

    const [plexSync, setPlexSync] = useState(true);

    const handleRequestRefreshAll = async () => {
        if (mediaId) {
            await apiClient.put(`items/${mediaId}/refreshMediaSources`);
            if (plexSync) await apiClient.put(`items/${mediaId}/plexsync`);
            onClose();
        }
    }

    if (open) {
        return (<Dialog
            fullScreen={fullScreenDialog}
            open={open}
            onClose={onClose}
            // fullWidth={true}
            // classes={{ paper: !fullScreenDialog && classes.dialogPaper }}
            aria-labelledby="alert-dialog-title">
            <DialogTitle>Refresh Media sources</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to request refreshing of all the media sources?
                </DialogContentText>
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={plexSync} onChange={(ev) => setPlexSync(ev.target.checked)} />} label="Plex sync" />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>Cancel</Button>
                <Button color="primary" onClick={handleRequestRefreshAll}>Yes</Button>
            </DialogActions>
        </Dialog>
        );
    } else {
        return <div></div>
    }
}