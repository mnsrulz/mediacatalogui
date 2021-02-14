import React from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import moment from 'moment';

const PlaylistGridComponent = ({ data }) => {
    const mo = moment;
    const columns = [{
        name: "title",
        options: {
            customBodyRender: (value, tableMeta) => {
                return (
                    <Link href={`/playlistdetails/${data[tableMeta.rowIndex].id}`} >
                        {value}
                    </Link>
                );
            }
        }
    }, {
        name: "ts", label: "Created", options: {
            customBodyRender: (value) => {
                return (
                    <div title={value}>{mo(value).fromNow()}</div>
                );
            }
        }
    }];
    const options = {
        download: false,
        print: false,
        viewColumns: false,
        searchable: false,
        filterType: 'multiselect',
        confirmFilters: true,
        selectableRows: false,
        customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
            return (
                <div style={{ marginTop: '40px' }}>
                    <Button variant="contained" onClick={applyNewFilters}>Apply Filters</Button>
                </div>
            );
        }
    };

    return <MUIDataTable
        title={
            <Typography variant="h6">
                Playlist
          {/* {isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />} */}
            </Typography>
        }
        data={data}
        columns={columns}
        options={options}
    />;
}

export default PlaylistGridComponent;