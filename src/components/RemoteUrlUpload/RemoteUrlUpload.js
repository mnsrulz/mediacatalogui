import React, { useEffect, useState } from 'react';
import MUIDataTable from "mui-datatables";
import { apiClient } from "./../ApiClient/MediaCatalogNetlifyClient";
import { useParams } from 'react-router-dom';
const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

export const RemoteUrlUploadRequestList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    let { requestId } = useParams();
    useEffect(() => {
        (async () => {
            const response = await apiClient.get(`/remoteUrlUploadRequest${requestId ? `?requestId=${requestId}` : ''}`);
            setRows(response.data);
            setIsLoading(false);
        })();
    }, [requestId]);

    const columns = ["requestId", "fileName", "sequence", "status", {
        name: "ts", options: {
            customBodyRenderLite: (dataIndex) => dayjs(rows[dataIndex].ts).fromNow()
        }
    }];
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