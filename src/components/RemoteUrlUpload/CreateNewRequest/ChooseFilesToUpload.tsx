import { DataGrid, GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import prettyBytes from 'pretty-bytes';
import axios from 'axios';

export const ChooseFilesToUpload = ({ defaultZipFileUrl, onSelectionChange }: ChooseFilesToUploadProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([] as {id: string}[]);
    const [error, setError] = useState('');

    const columns: GridColumns = [
        { field: 'path', headerName: 'Path', minWidth: 400, flex: 1 },
        { field: 'uncompressedSize', headerName: 'Size', width: 100, valueFormatter: ({ value }) => prettyBytes(parseInt(value?.toString() || '0')) },
    ];

    useEffect(() => {
        (async () => {
            const fetchUrl = `https://mediacatalogdirectorylisting.herokuapp.com/api/zip/listFiles?zipFileUrl=${encodeURIComponent(defaultZipFileUrl)}`;
            
            try {
                const response = await axios.get<{path:string}[]>(fetchUrl);
                const mappedResult = response.data.map(x => ({ ...x, id: x.path }));
                setData(mappedResult);
                setIsLoading(false);
            } catch (error) {
                setError(error.message);
            }
        })()
    }, [defaultZipFileUrl])

const handleSelectionChange = (selectionModel: GridSelectionModel)=>{
    const model = selectionModel.map(x=>({path: x.toString()}));
    onSelectionChange(model);
}

    if (error) {
        return <div> Error: We have some errrors </div>;
    } else {
        return <DataGrid
            autoHeight
            rows={data}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={handleSelectionChange}
            disableColumnMenu
            disableColumnSelector
            loading={isLoading}
        />

    }
}

type ChooseFilesToUploadProps = {
    defaultZipFileUrl: string,
    onSelectionChange: (p: SelectionChangeModel) => void
}

type SelectionChangeModel = { path: string }[]