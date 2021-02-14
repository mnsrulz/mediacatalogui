import React from 'react';
import { Typography, Button, Link } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import PlaylistGrid from '../Playlist/playlistGrid';

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
        const idToken = JSON.parse(localStorage.token).tokenId;
        headers.append('Authorization', 'Bearer ' + idToken);
        const apiUrl = 'https://mediacatalog.netlify.app/.netlify/functions/server/playlists';
        const response = await fetch(apiUrl, { headers: headers });

        const tempdata = await response.json();
        console.log(tempdata);

        this.setState({
            isLoaded: true,
            data: tempdata
        });

    }
    render() {
        

        const { error, isLoaded, data } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return <PlaylistGrid data = {data}></PlaylistGrid>;
        }
    }
}

export default myComponent;