import React, { useEffect, useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient'

const columns = [
    { field: 'renderedTitle', headerName: 'Title', sortable: false, flex: 1 },
    { field: 'crawlerType', headerName: 'Type', sortable: false, flex: 0.3 },
    { field: 'created', headerName: 'Created', sortable: false , flex: 0.5},
    { field: 'modified', headerName: 'Last Modified', sortable: false , flex: 0.5},
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //         `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    // },
];

export default function MediaSourceList() {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await apiClient.get(`/mediasources?pageSize=${pageSize}&pageNumber=${page}`);
            setRowCount(response.data.total);
            setRows(response.data.items);
            setLoading(false);
        })();
    }, [page]);

    const handlePageChange = (params) => {
        const { page } = params;
        setPage(page);
    }

    return <div>
        <div>
            <DataGrid
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
    </div>
}