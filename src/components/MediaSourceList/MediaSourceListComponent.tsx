import React, { useEffect, useState } from 'react';
import { DataGrid, GridColumns } from '@material-ui/data-grid';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'
import { MenuItem } from '@material-ui/core';
import SourceType from "./SourceTypeComponent";
import { MovieFetchComponent } from "./MovieFetchComponent";
import { InputWithDropdownComponent } from './InputWithDropdownComponent';
import SourceDeleteComponent from './SourceDeleteComponent';
import axios from 'axios';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

export const MediaSourceListComponent = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [rows, setRows] = useState<{
        mediaItemId: string | null; id: string
    }[]>([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [pendingSelection, setPendingSelection] = useState('Pending');

    const fxhandleMediaAssignment = async (result: {
        mediaItemId: string; mediaSourceId: string
    }[]) => {
        const updatedRows = rows.map(x => {
            const matchingResult = result.find(y => y.mediaSourceId === x.id);
            if (matchingResult) {
                x.mediaItemId = matchingResult.mediaItemId;
            }
            return x;
        })
        setRows(updatedRows);
    };

    const fxhandleMediaSourceWithdrawl = (mediaSourceId: string) => {
        const updatedRows = rows.map(x => {
            x.id === mediaSourceId && (x.mediaItemId = null);
            return x;
        })
        setRows(updatedRows);
    };

    /*
    Change layout in mobile device.. for now setting min width to workout...
    */

    const columns: GridColumns = [
        { field: 'renderedTitle', headerName: 'Title', minWidth: 400, sortable: false, flex: 1 },
        {
            field: 'parserInfo', headerName: 'Parser Title', sortable: false, width: 280, renderCell: ({ value, row }) => {
                return <MovieFetchComponent
                    value={((value as { title: string }).title) || row.renderedTitle}
                    isTv={(value as { isTv: boolean }).isTv}
                    mediaSourceId={row.id}
                    mediaItemId={row.mediaItemId}
                    handleMediaAssignment={fxhandleMediaAssignment}
                    handleMediaSourceWithdrawl={fxhandleMediaSourceWithdrawl}
                />
            }
        },
        {
            field: 'crawlerType', headerName: 'Source', sortable: false, width: 80, renderCell: ({ value }) => {
                return <SourceType value={`${value}`}></SourceType>
            }
        },
        { field: 'created', headerName: 'Created', sortable: false, width: 120, valueFormatter: ({ value }) => dayjs(value).fromNow() },
        { field: 'modified', headerName: 'Last Modified', sortable: false, width: 120, valueFormatter: ({ value }) => dayjs(value).fromNow() }
    ];


    const handleOnChange = (value: string) => {
        setPage(0);
        setSearch(value);
    };

    useEffect(() => {
        const abortController = new AbortController();
        (async () => {
            const searchQuery = search;
            setLoading(true);
            const onlyPending = pendingSelection === 'Pending';
            const response = await apiClient.get(`/mediasources?pageSize=${pageSize}&pageNumber=${page + 1}&q=${search}&onlyPendingMediaAssignment=${onlyPending}`, {
                signal: abortController.signal,
            });
            if (abortController.signal.aborted) return;
            if (search === searchQuery) {
                setRowCount(response.data.total);
                setRows(response.data.items);
                setLoading(false);
            }
        })();
        return () => abortController.abort();
    }, [page, search, pendingSelection, pageSize]);

    const handlePendingSelectionChange = (value: string) => {
        setPendingSelection(value);
    };

    return <div>
        <InputWithDropdownComponent
            pendingSelection={pendingSelection}
            handlePendingSelectionChange={handlePendingSelectionChange}
            defaultValue={search}
            onInputChange={handleOnChange}
            showSearchIcon={false} >
            <MenuItem value={'All'}>All</MenuItem>
            <MenuItem value={'Pending'}>Pending</MenuItem>
        </InputWithDropdownComponent>

        <DataGrid
            page={page}
            autoHeight={true}
            rows={rows}
            columns={columns}
            pageSize={pageSize}
            paginationMode='server'
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            loading={loading}
            rowCount={rowCount}
            checkboxSelection={false}
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
        />
    </div>
}
