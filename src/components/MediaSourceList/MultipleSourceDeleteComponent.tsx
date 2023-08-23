import { Button, DialogActions } from '@material-ui/core';
import React, { useState } from 'react';
import { IconButton, LinearProgress } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { Dialog, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';

type SourceDeleteProps = {
  mediaSourceIds: string[],
  onDelete: any
}

export default function MultipleSourceDeleteComponent({ mediaSourceIds, onDelete }: SourceDeleteProps) {

  const [open, setOpen] = useState(false);
  const [progress, setProgress] = React.useState(0);
  const [isProgressBarHidden, setIsProgressBarHidden] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fxhandleMediaSourceRemove = async () => {
    let counter = 0;
    setIsProgressBarHidden(false);
    for(const mediaSourceId of mediaSourceIds){
      setProgress(Math.round((counter++/mediaSourceIds.length) * 100));
      await apiClient.delete(`mediasources/${mediaSourceId}`)
    }
    setIsProgressBarHidden(true);
    handleClose();
    onDelete();
    
  }

  return mediaSourceIds.length > 1 ? <div>
    <IconButton aria-label="delete" onClick={handleClickOpen}>
      <DeleteIcon />
    </IconButton>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        Delete Confirm?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will delete the selected media sources permanently. Are you sure you want to delete?
          <LinearProgress variant="determinate" value={progress} hidden={isProgressBarHidden} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={fxhandleMediaSourceRemove} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  </div> : <div></div>
}
