import React from 'react';
import MUIDataTable from "mui-datatables";

class myComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: []
        };
    }

    async componentDidMount() {
        var headers = new Headers();
        const idToken = JSON.parse(sessionStorage.token).tokenId;
        headers.append('Authorization', 'Bearer ' + idToken);
        const apiUrl = 'https://mediacatalog.netlify.app/.netlify/functions/server/remoteUrlUploadRequest';
        const response = await fetch(apiUrl, { headers: headers });

        const tempdata = await response.json();
        console.log(tempdata);

        this.setState({
            isLoaded: true,
            data: tempdata
        });

    }
    render() {
        const columns = ["ts", "requestId", "fileName", "sequence", "status"];
        const options = {
            filterType: 'checkbox',
            download: false,
            print: false
        };

        const { error, isLoaded, data} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return <MUIDataTable
                title={"Remote Url Upload Requests"}
                data={data}
                columns={columns}
                options={options}
            />;
        }
    }
}

export default myComponent;