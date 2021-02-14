import React from 'react';
import MovieList from '../Playlist/movieList'
class myComponent extends React.Component {
    constructor(props) {
        super(props);        
        this.state = {
            error: null,
            isLoaded: false,
            data: [],
            playlistId: props.playlistId
        };
    }

    async componentDidMount() {
        var headers = new Headers();
        const idToken = JSON.parse(localStorage.token).tokenId;
        headers.append('Authorization', 'Bearer ' + idToken);
        const apiUrl = `https://mediacatalog.netlify.app/.netlify/functions/server/playlists/${this.state.playlistId}/items`;
        const response = await fetch(apiUrl, { headers: headers });
        const tempdata = await response.json();
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
            return <MovieList movies={data}></MovieList>
        }
    }
}

export default myComponent;