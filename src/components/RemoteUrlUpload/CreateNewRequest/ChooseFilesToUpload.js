import { DataGrid } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import prettyBytes from 'pretty-bytes';

export const ChooseFilesToUpload = ({ defaultZipFileUrl, onSelectionChange }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    const columns = [
        { field: 'path', headerName: 'Path', minWidth: 400, flex: 1 },
        { field: 'uncompressedSize', headerName: 'Size', width: 100, valueFormatter: ({ value }) => prettyBytes(value) },
    ];

    useEffect(() => {
        (async () => {
            const fetchUrl = `https://mediacatalogdirectorylisting.herokuapp.com/api/zip/listFiles?zipFileUrl=${encodeURIComponent(defaultZipFileUrl)}`;
            const response = await fetch(fetchUrl);
            try {
                const responseAsJson = await response.json();
                const mappedResult = responseAsJson.map(x => ({ ...x, id: x.path }));
                setData(mappedResult);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
            }
        })()
    }, [defaultZipFileUrl])

    if (error) {
        return <div> Error: We have some errrors </div>;
    } else {
        return <DataGrid
                autoHeight
                rows={data}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(selectionModel) => {
                    onSelectionChange(selectionModel.map(x => ({ path: x })));
                }}
                disableColumnMenu
                disableColumnSelector
                loading={isLoading}        
            />
        
    }
}