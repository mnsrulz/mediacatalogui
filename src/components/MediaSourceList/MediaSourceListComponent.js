import React, { useEffect, useState } from 'react';
import { DataGrid, GridColumns } from '@material-ui/data-grid';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { debounce, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SourceType from "./SourceTypeComponent";
import { MovieFetchComponent } from "./MovieFetchComponent";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
}));


export const MediaSourceListComponent = () => {
    const [page, setPage] = useState(0);
    const [pageSize] = useState(20);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pendingSelection, setPendingSelection] = useState('Pending');
    const classes = useStyles();

    const fxhandleMediaAssignment = async (result) => {
        const updatedRows = rows.map(x => {
            const matchingResult = result.find(y => y.mediaSourceId === x.id);
            if (matchingResult) {
                x.mediaItemId = matchingResult.mediaItemId;
            }
            return x;
        })
        setRows(updatedRows);
    };

    const columns = [
        { field: 'renderedTitle', headerName: 'Title', width: 340, sortable: false, flex: 1 },
        {
            field: 'parserInfo', headerName: 'Parser Title', sortable: false, width: 280, renderCell: ({ value, row }) => {
                return <MovieFetchComponent
                    value={value?.title || row.renderedTitle} isTv={value?.isTv}
                    mediaSourceId={row.id}
                    mediaItemId={row.mediaItemId}
                    handleMediaAssignment={fxhandleMediaAssignment}
                />
            }
        },
        {
            field: 'crawlerType', headerName: 'Source', sortable: false, width: 80, renderCell: ({ value }) => {
                return <SourceType value={value}></SourceType>
            }
        },
        { field: 'created', headerName: 'Created', sortable: false, width: 120, valueFormatter: ({ value }) => dayjs(value).fromNow() },
        { field: 'modified', headerName: 'Last Modified', sortable: false, width: 120, valueFormatter: ({ value }) => dayjs(value).fromNow() }
    ];


    const handleOnChange = (event) => {
        const { value } = event.target;
        setPage(0);
        setSearch(value);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const onlyPending = pendingSelection === 'Pending';
            const response = await apiClient.get(`/mediasources?pageSize=${pageSize}&pageNumber=${page + 1}&q=${search}&onlyPendingMediaAssignment=${onlyPending}`);
            setRowCount(response.data.total);
            setRows(response.data.items);
            setLoading(false);
        })();
    }, [page, search, pendingSelection, pageSize]);

    const handlePageChange = (params) => {
        const { page } = params;
        setPage(page);
    }

    return <div>
        <TextField label="Search" placeholder="Search" fullWidth
            onChange={debounce(handleOnChange, 250)}
            defaultValue={search} className={classes.searchbar} />
        <ToggleButtonGroup value={pendingSelection} exclusive onChange={(ev, val) => setPendingSelection(val)}>
            <ToggleButton value="All">
                All
            </ToggleButton>
            <ToggleButton value="Pending" >
                Pending
            </ToggleButton>
        </ToggleButtonGroup>

        <DataGrid
            page={page}
            autoHeight={true}
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={handlePageChange}
            loading={loading}
            rowCount={rowCount}
            checkboxSelection={false}
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
        />
    </div>
}