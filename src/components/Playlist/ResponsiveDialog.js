import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

export default function ResponsiveDialog({ confirmText, okButtonText, cancelButtonText, clickHandler, open }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    //   const handleClickOpen = () => {
    //     setOpen(true);    
    //   };

    const handleClose = (result) => {
        clickHandler(result);
        //clickHandler(result === 0 ? 'Cancel' : 'Ok');
    };

    return (
        <div>
            {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open responsive dialog
      </Button> */}
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={()=>handleClose('Cancel')}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {confirmText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={()=>handleClose('Cancel')} color="primary">
                        {cancelButtonText}
                    </Button>
                    <Button onClick={()=>handleClose('Ok')} color="primary" autoFocus>
                        {okButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}