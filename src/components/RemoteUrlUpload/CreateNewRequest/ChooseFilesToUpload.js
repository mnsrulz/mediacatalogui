import React, { useState } from 'react';

export const ChooseFilesToUpload= ({defaultZipFileUrl, onSelectionChange})=> {
    return <div>
        hello
    </div>
}
//     constructor(props) {
//         // debugger;
//         super(props);
//         this.state = {
//             error: null,
//             isLoaded: false,
//             data: [],
//             zipFileUrl: props.defaultZipFileUrl,
//             onSelectionChange: props.onSelectionChange
//         };

//     }

//     async componentDidMount() {
//         const fetchUrl = `https://mediacatalogdirectorylisting.herokuapp.com/api/zip/listFiles?zipFileUrl=${encodeURIComponent(this.state.zipFileUrl)}`;
//         const response = await fetch(fetchUrl);
//         try {
//             const responseAsJson = await response.json();
//             this.setState({
//                 isLoaded: true,
//                 data: responseAsJson
//             });
//         } catch (error) {
//             this.setState({
//                 error: error
//             });
//         }

//     }

//     handleSelectionChange = (p, q, r, s) => {
//         const selectedData = q.map(i => this.state.data[i.index]);
//         this.state.onSelectionChange && this.state.onSelectionChange(selectedData);
//     }

//     render() {
//         const columns = ["path", "uncompressedSize"];
//         const options = {
//             download: false,
//             print: false,
//             search: false,
//             viewColumns: false,
//             filter: false,
//             pagination: false,
//             onRowSelectionChange: this.handleSelectionChange
//         };

//         const { error, isLoaded, data } = this.state;

//         if (error) {
//             return <div>Error: We have some errrors</div>;
//         } else if (!isLoaded) {
//             return <div>Fetching files inside zip file...</div>;
//         } else {
//             return <MUIDataTable
//                 title={"Upload Requests"}
//                 data={data}
//                 columns={columns}
//                 options={options}
//             />;
//         }
//     }
// }