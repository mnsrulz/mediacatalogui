import React, { useEffect, useState } from 'react';
import { apiClient } from "./../ApiClient/MediaCatalogNetlifyClient";
import { useParams } from 'react-router-dom';
import { Box, Button, LinearProgress, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';

const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

export const RemoteUrlUploadRequestList = () => {
    let { requestId } = useParams();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const statuses = ['queued', 'running', 'completed', 'error'];

    return <Paper>
        <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs"
            scrollButtons="auto"
        >
            {
                statuses.map(status => {
                    return <Tab label={status} />
                })
            }
        </Tabs>
        <RemoteUploadRequestList requestId={requestId} status={statuses[value]} />
    </Paper>
}

const RemoteUploadRequestList = ({ requestId, status }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const loadFn = async () => {            
            const response = await apiClient.get(`/remoteUrlUploadRequest?status=${status}${requestId ? `&requestId=${requestId}` : ''}`);
            setRows(response.data);            
        }
        const handle = setInterval(async () => {
            await loadFn();
        }, 1000);
        (async () => {
            await loadFn();
            setIsLoading(false);
        })();
        return () => clearInterval(handle); //cleanup
    }, [requestId, status]);

    const handleOnRequeueClick = async (id) => {
        await apiClient.post(`/remoteUrlUploadRequest/${id}/requeue`);
        const status = 'queued';
        const updatedRows = rows.map(el => (el.id === id ? { ...el, status } : el));
        setRows(updatedRows);
    }

    const RequestProgressBar = ({ progress }) => {
        if (progress && progress.uploaded && progress.size) {
            const value = (100 * progress.uploaded) / progress.size;
            return <Box display="flex" alignItems="center" style={{ width: '100%' }}>
                <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={value} />
                </Box>
                <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
                </Box>
            </Box>
        }
        return <div></div>
    }

    const columns = [
        { field: 'requestId', headerName: 'Request', sortable: false },
        { field: 'fileName', sortable: false, flex: 1 },
        { field: 'sequence', sortable: false },
        { field: 'ts', headerName: 'Created', sortable: false, width: 120, valueFormatter: ({ value }) => dayjs(value).fromNow() },
        {
            field: 'id', headerName: 'Progress', sortable: false, width: 150, renderCell: ({ value, row }) => {                
                if (row.status === 'error') {
                    return <Button size='small' onClick={() => handleOnRequeueClick(value)} variant="text" color="primary" disableElevation>Requeue</Button>
                } else if (row.status === 'running') {
                    const lastProgressSinceMinutes = row.progress && dayjs(dayjs()).diff(row.progress.updated, 'm');
                    return <div>
                        {(lastProgressSinceMinutes > 1) &&
                            <Button size='small' onClick={() => handleOnRequeueClick(value)} variant="text" color="primary" disableElevation>ReRun
                                <RequestProgressBar progress={row.progress} />
                            </Button>
                        }
                    </div>
                }
                return <div></div>
            },
            hide: ['completed', 'queued'].includes(status)
        },
        // { field: 'progress', sortable: false, renderCell: ({ value }) => <RequestProgressBar progress={value} /> }
    ];
    return <DataGrid        
        autoHeight={true}
        rows={rows}
        columns={columns}
        pageSize={10}
        loading={isLoading}        
        checkboxSelection={false}
        disableColumnMenu
        disableColumnSelector
        disableSelectionOnClick
    />
}