import React, {  } from 'react';
import { Dialog, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import { SourceExplorer } from './SourceExplorer';

const useStyles = makeStyles((theme) => ({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    }
}));

export const ViewSourceDialog = ({ open, mediaId, rootTitle, onClose }) => {
    const classes = useStyles();
    if (open) {
        return (<Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            aria-labelledby="responsive-dialog-title">
            <DialogTitle>Sources...</DialogTitle>
            <DialogContent dividers>
                <SourceExplorer mediaId={mediaId} rootTitle={rootTitle} />
            </DialogContent>
        </Dialog>
        );
    } else {
        return <div></div>
    }
}