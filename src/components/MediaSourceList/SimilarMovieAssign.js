import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, FormControlLabel, FormGroup, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core"
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete'
import CheckIcon from '@material-ui/icons/Check'
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    },
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
}));

export const SimilarMovieAssign = ({ show, mediaItemId, query, handleSelect }) => {
    const classes = useStyles();
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query) return;
        if (!show) return;
        (async () => {
            const response = await apiClient.get(`mediasources?parsedTitle=${encodeURIComponent(query)}&onlyPendingMediaAssignment=true`);
            setResults(response.data.items);
        })();
    }, [query, show]);

    const handleClose = () => {
        handleSelect();
    };

    return (
        <div>
            <Dialog open={show}
                fullWidth={true}
                classes={{ paper: classes.dialogPaper }}
                onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle style={{ padding: 0 }}>
                    {query}
                    {mediaItemId}
                </DialogTitle>
                <DialogContent dividers>
                    {
                        results && (<List>
                            {results.map((value) => {
                                return (<ListItem key={value.id}>
                                    <ListItemText primary={value.renderedTitle} />
                                    <ListItemSecondaryAction>
                                        <MyLittleAction mediaSourceId={value.id} mediaItemId={mediaItemId} />
                                    </ListItemSecondaryAction>
                                </ListItem>)
                            })}
                        </List>)
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export const MyLittleAction = ({ mediaSourceId, mediaItemId }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleAssignClick = async () => {
        setLoading(true);
        await apiClient.put(`/mediasources/${mediaSourceId}/mediaItemId/${mediaItemId}`);
        setLoading(false);
        setSuccess(true);
    }
    return <div className={classes.wrapper}>
        <Fab color="primary"
            size="small"
            className={classes.buttonSuccess}
            onClick={success ? null : handleAssignClick}>
            {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
    </div>
}