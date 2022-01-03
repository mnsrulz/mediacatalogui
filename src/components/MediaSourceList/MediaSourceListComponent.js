import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { debounce, Divider, IconButton, InputBase, MenuItem, Paper, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SourceType from "./SourceTypeComponent";
import { MovieFetchComponent } from "./MovieFetchComponent";
import SearchIcon from '@material-ui/icons/Search';

const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
    root: {
        padding: '2px 8px 2px 16px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing(3),
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: '8px 8px'
    },
    divider: {
        height: 32,        
        marginLeft: theme.spacing(1)
    },
    searchDropdownSelect: {
        '&:focus': {
            backgroundColor: 'white'
        }        
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

    const fxhandleMediaSourceWithdrawl = (mediaSourceId) => {
        const updatedRows = rows.map(x => {
            x.id === mediaSourceId && (x.mediaItemId = null);
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
                    handleMediaSourceWithdrawl={fxhandleMediaSourceWithdrawl}
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

    const handlePageChange = (p) => {
        setPage(p);
    }

    const handlePendingSelectionChange = (event) => {
        setPendingSelection(event.target.value);
    };

    return <div>
        <Paper component="form" className={classes.root} >
            <Select
                variant='standard'
                //className={classes.searchDropdownSelect}
                classes={{ 
                    //root: classes.searchDropdown,
                    select: classes.searchDropdownSelect
                }}
                value={pendingSelection}
                onChange={handlePendingSelectionChange}
            >
                <MenuItem value={'All'}>All</MenuItem>
                <MenuItem value={'Pending'}>Pending</MenuItem>
            </Select>
            <Divider className={classes.divider} orientation="vertical" />
            <InputBase autoFocus className={classes.input} placeholder="Search"
                onChange={debounce(handleOnChange, 250)}
                defaultValue={search} />
            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>

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
