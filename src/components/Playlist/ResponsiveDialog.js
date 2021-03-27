import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export const ResponsiveDialog = ({ confirmText, okButtonText, cancelButtonText, clickHandler, open }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = (result) => {
        clickHandler(result);
    };

    return (
        <div>
            <Dialog fullScreen={fullScreen}
                open={open}
                onClose={() => handleClose('Cancel')}
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{confirmText}</DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClose('Cancel')} color="primary">
                        {cancelButtonText}
                    </Button>
                    <Button onClick={() => handleClose('Ok')} color="primary" autoFocus>
                        {okButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}