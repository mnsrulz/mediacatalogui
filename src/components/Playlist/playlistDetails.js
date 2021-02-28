import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import { debounce } from '@material-ui/core';
import MovieList from '../Playlist/movieList'
// class myComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             error: null,
//             isLoaded: false,
//             data: [],
//             playlistId: props.playlistId
//         };
//     }

//     async componentDidMount() {
//         var headers = new Headers();
//         const idToken = JSON.parse(localStorage.token).tokenId;
//         headers.append('Authorization', 'Bearer ' + idToken);
//         const apiUrl = `https://mediacatalog.netlify.app/.netlify/functions/server/playlists/${this.state.playlistId}/items`;
//         const response = await fetch(apiUrl, { headers: headers });
//         const tempdata = await response.json();
//         this.setState({
//             isLoaded: true,
//             data: tempdata
//         });

//     }
//     render() {
//         const { error, isLoaded, data } = this.state;

//         if (error) {
//             return <div>Error: {error.message}</div>;
//         } else if (!isLoaded) {
//             return <div>Loading...</div>;
//         } else {
//             return <MovieList items={data}></MovieList>
//         }
//     }
// }

export default function PlaylistDetails({playlistId}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const idToken = JSON.parse(localStorage.token).tokenId;            
            setLoading(true);
            const apiUrl = `https://mediacatalog.netlify.app/.netlify/functions/server/playlists/${playlistId}/items`;
            const result = await axios(apiUrl, {
                headers: {
                    Authorization: 'Bearer ' + idToken
                }
            });
            setData(result.data);
            setLoading(false);
        })();
    }, []);

    return (
        <div>            
            {/* <TextField label="Search" placeholder="Search" fullWidth
                onChange={debounce(handleOnChange, 250)} defaultValue={search} /> */}
            <MovieList items={data} isLoading={loading}></MovieList>
        </div>
    );

};