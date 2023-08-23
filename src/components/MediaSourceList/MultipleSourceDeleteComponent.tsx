import { Button, DialogActions } from '@material-ui/core';
import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { Dialog, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';

type SourceDeleteProps = {
  mediaSourceIds: string[],
  onDelete: any
}

export default function MultipleSourceDeleteComponent({ mediaSourceIds, onDelete }: SourceDeleteProps) {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fxhandleMediaSourceRemove = async () => {
    mediaSourceIds.forEach(console.log);
    for(const mediaSourceId of mediaSourceIds){
      await apiClient.delete(`mediasources/${mediaSourceId}`)
    }
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
          This will delete this media source permanently. Are you sure you want to delete?
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
