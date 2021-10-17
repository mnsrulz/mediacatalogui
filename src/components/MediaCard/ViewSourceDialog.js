import React, { } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, useMediaQuery } from '@material-ui/core';
import { SourceExplorer } from './SourceExplorer';
import { useTheme } from '@material-ui/core/styles';
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

    const assignImdbId = () => {

    };

    if (open) {
        return (<Dialog
            fullScreen={fullScreenDialog}
            open={open}
            onClose={onClose}
            fullWidth={true}
            classes={{ paper: !fullScreenDialog && classes.dialogPaper }}
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>{rootTitle} : External Sources</DialogTitle>
            <DialogContent dividers classes={{ root: classes.dialogContent }}>
                
                Tmdb: {tmdbId}
                    <br/>
                Imdb: {imdbId}
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