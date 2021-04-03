import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles } from '@material-ui/core';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";
import DeleteIcon from '@material-ui/icons/Delete';
import { Link, useParams } from 'react-router-dom';

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