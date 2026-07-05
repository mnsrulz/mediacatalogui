import { DataGrid, GridColumns, GridSelectionModel } from '@material-ui/data-grid';
import React, { useState, useEffect } from 'react';
import prettyBytes from 'pretty-bytes';
import axios from 'axios';

export const ChooseFilesToUpload = ({ defaultZipFileUrl, onSelectionChange }: ChooseFilesToUploadProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([] as { id: number, fileName: string, downloadLink: string }[]);
    const [error, setError] = useState('');

    const columns: GridColumns = [
        { field: 'fileName', headerName: 'Path', minWidth: 400, flex: 1 },
        { field: 'uncompressedSize', headerName: 'Size', width: 100, valueFormatter: ({ value }) => prettyBytes(parseInt(value?.toString() || '0')) },
    ];

    useEffect(() => {
        (async () => {
            const fetchUrl = ` https://zipservice.mztrading.workers.dev/files?u=${encodeURIComponent(defaultZipFileUrl)}`;
            try {
                const response = await axios.get<{ fileName: string, downloadLink: string }[]>(fetchUrl);
                const mappedResult = response.data.filter(k => Boolean(k.downloadLink)).map((x, ix) => ({ ...x, id: ix }));
                setData(mappedResult);
                setIsLoading(false);
            } catch (error: Error | any) {
                setError(error.message);
            }
        })()
    }, [defaultZipFileUrl])

    const handleSelectionChange = (selectionModel: GridSelectionModel) => {
        const model = selectionModel.map(x => ({ fileName: data[parseInt(x.toString())].fileName, fileUrl: data[parseInt(x.toString())].downloadLink }));
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

type SelectionChangeModel = { fileName: string, fileUrl: string }[]