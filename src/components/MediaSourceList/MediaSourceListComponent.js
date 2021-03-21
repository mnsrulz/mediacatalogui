import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { debounce, TextField, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SourceType from "./SourceTypeComponent";
import MovieFetchComponent from "./MovieFetchComponent";
const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
}));

const columns = [
    { field: 'renderedTitle', headerName: 'Title', sortable: false, flex: 1 },
    {
        field: 'parserInfo', headerName: 'Parser Title', sortable: false, flex: 1, renderCell: ({ value }) => {
            return <MovieFetchComponent value={value?.title} isTv={value?.isTv}></MovieFetchComponent>
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

export default function MediaSourceList() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const classes = useStyles();

    const handleOnChange = (event) => {
        const { value } = event.target;
        setPage(0);
        setSearch(value);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await apiClient.get(`/mediasources?pageSize=${pageSize}&pageNumber=${page + 1}&q=${search}`);
            setRowCount(response.data.total);
            setRows(response.data.items);
            setLoading(false);
        })();
    }, [page, search]);

    const handlePageChange = (params) => {
        const { page } = params;
        setPage(page);
    }

    return <div>
        <TextField label="Search" placeholder="Search" fullWidth
            onChange={debounce(handleOnChange, 250)}
            defaultValue={search} className={classes.searchbar} />
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