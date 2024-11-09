import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
// import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import { apiClient } from './ApiClient/MediaCatalogNetlifyClient';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, LinearProgress, TextField } from '@material-ui/core';
import { GridColumns, DataGrid } from '@material-ui/data-grid';
import ShuffleIcon from '@material-ui/icons/Shuffle';
// Generate Sales Data
function createData(time: string, amount: number | undefined) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function Chart() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [random, setRandom] = useState('');
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      setLoading(true);
      const result = await apiClient.get(`/mediasources/stats`, { signal: abortController.signal });
      setData(result.data);
      setLoading(false);
    })();
    return () => abortController.abort();
  }, [random]);

  const columns: GridColumns = [
    { field: 'id', headerName: 'Host', flex: 1 },
    { field: 'count', headerName: 'Count', flex: 1, type: 'number' },
    {
      field: 'migrate', headerName: 'Migrate', align: 'right', headerAlign: 'right', sortable: false, width: 120, renderCell: ({ row }) => {
        return <HostMigrateDialog origin={`${row.id}`} count={row.count} onDelete={() => {
          setRandom(`${Math.random()}`);  //to force refresh grid after batch deletion
        }} />
      }
    }
  ];
  return <DataGrid
    autoHeight={true}
    rows={data}
    columns={columns}
    pageSize={10}
    loading={isLoading}
    checkboxSelection={false}
    disableColumnMenu
    disableColumnSelector
    disableSelectionOnClick
  />

}

type HostMigrateDialogProps = {
  origin: string,
  count: number,
  onDelete: any
}

function HostMigrateDialog({ origin, count, onDelete }: HostMigrateDialogProps) {
  const [open, setOpen] = useState(false);
  const [newOrigin, setNewOrigin] = useState(origin);
  const [isProgressBarHidden, setIsProgressBarHidden] = React.useState(true);
  const [progress, setProgress] = React.useState(0);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (progress > 0) onDelete();
  };

  const fxhandleOriginMigration = async () => {
    const batchSize = 100;
    let counter = 0;
    setIsProgressBarHidden(false);
    while ((counter < count) && open) {
      await apiClient.post(`/mediasources/migrateOrigin?fromOrigin=${origin}&toOrigin=${newOrigin}&limit=${batchSize}`);
      // await new Promise(resolve => setTimeout(resolve, 100));
      counter = batchSize + counter;
      setProgress(Math.round((counter / count) * 100));
    }
    setIsProgressBarHidden(true);
    handleClose(); onDelete();
  }

  return <div>
    <IconButton aria-label="delete" onClick={handleClickOpen}>
      <ShuffleIcon />
    </IconButton>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        Migration
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          id="username"
          name="To Origin"
          label="To Origin"
          value={newOrigin}
          onChange={(v) => setNewOrigin(v.target.value)}
        />
        <DialogContentText id="alert-dialog-description">
          There are {count} documents. This will migrate all of the media sources to the new host.. Are you sure you want to continue?
          <LinearProgress variant="determinate" value={progress} hidden={isProgressBarHidden} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={fxhandleOriginMigration} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  </div>
}
