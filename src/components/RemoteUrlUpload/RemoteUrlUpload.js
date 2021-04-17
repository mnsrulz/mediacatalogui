import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { apiClient } from "./../ApiClient/MediaCatalogNetlifyClient";
const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);


export const RemoteUrlUploadRequestList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    useEffect(() => {
        (async () => {
            const response = await apiClient.get('/remoteUrlUploadRequest');
            setRows(response.data);
            setIsLoading(false);
        })();
    }, []);

    const columns = [{
        name: "ts", options: {
            customBodyRenderLite: (dataIndex) => dayjs(rows[dataIndex].ts).fromNow()
        }
    }, "requestId", "fileName", "sequence", "status"];
    const options = {
        filterType: 'checkbox',
        download: false,
        print: false
    };

    if (isLoading) {
        return <div>Loading...</div>;
    } else {
        return <MUIDataTable
            title={"Remote Url Upload Requests"}
            data={rows}
            columns={columns}
            options={options}
        />;
    }
}