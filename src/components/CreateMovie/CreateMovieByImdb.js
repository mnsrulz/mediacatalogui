import React, { Component, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import Card from './Card';

class myComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            data: null,
            imdbId: 'tt0468569'
        };
    }

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    render() {
        return <div id="createMovieContainer000001">
            <TextField name="imdbId" label="IMDB Id" placeholder="Enter IMDB Id" fullWidth
                onChange={this.fetchMovieID} defaultValue={this.state.imdbId} />            
            <Card data={this.state} />
        </div>
    }


    // the api request function
    fetchApi(url) {

        fetch(url).then((res) => res.json()).then((data) => {
            // update state with API data
            this.setState({
                movieID: data.id,
                original_title: data.original_title,
                tagline: data.tagline,
                overview: data.overview,
                homepage: data.homepage,
                poster: data.poster_path,
                production: data.production_companies,
                production_countries: data.production_countries,
                genre: data.genres,
                release: data.release_date,
                vote: data.vote_average,
                runtime: data.runtime,
                revenue: data.revenue,
                backdrop: data.backdrop_path
            })
        })
    }

    findMovieIdByImdbId = async (v) => {
        const imdbMovieApiUrl = `https://api.themoviedb.org/3/find/${v}?&api_key=cfe422613b250f702980a3bbf9e90716&external_source=imdb_id`;
        const response = await fetch(imdbMovieApiUrl);
        const responseJson = await response.json();
        return responseJson.movie_results && responseJson.movie_results[0] && responseJson.movie_results[0].id;
    }

    fetchMovieID = async (e) => {
        const imdbId = e.target.value;
        this.setState({ imdbId: imdbId });
        const movieID = await this.findMovieIdByImdbId(imdbId);
        if (movieID) {
            let url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=cfe422613b250f702980a3bbf9e90716`
            this.fetchApi(url);
        }
    }

    async componentDidMount() {        
        const movieID = await this.findMovieIdByImdbId(this.state.imdbId);
        let url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=cfe422613b250f702980a3bbf9e90716`
        this.fetchApi(url)
    }
}

export default myComponent;