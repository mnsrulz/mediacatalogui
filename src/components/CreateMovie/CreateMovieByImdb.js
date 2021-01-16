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

        // .catch((err) => console.log('Movie not found!'))

    } // end function

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
            // let url = `https://api.themoviedb.org/3/find/${imdbId}?&api_key=cfe422613b250f702980a3bbf9e90716&external_source=imdb_id`
            this.fetchApi(url);
        }
    } // end function

    async componentDidMount() {        
        const movieID = await this.findMovieIdByImdbId(this.state.imdbId);

        let url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=cfe422613b250f702980a3bbf9e90716`
        //let url = `https://api.themoviedb.org/3/find/${this.state.imdbId}?&api_key=cfe422613b250f702980a3bbf9e90716&external_source=imdb_id`
        this.fetchApi(url)

        //========================= BLOODHOUND ==============================//
        // let suggests = new Bloodhound({
        //     datumTokenizer: function (datum) {
        //         return Bloodhound.tokenizers.whitespace(datum.value);
        //     },
        //     queryTokenizer: Bloodhound.tokenizers.whitespace,
        //     remote: {
        //         url: 'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=cfe422613b250f702980a3bbf9e90716',
        //         filter: function (movies) {
        //             // Map the remote source JSON array to a JavaScript object array
        //             return $.map(movies.results, function (movie) {
        //                 return {
        //                     value: movie.original_title, // search original title
        //                     id: movie.id // get ID of movie simultaniously
        //                 };
        //             });
        //         } // end filter
        //     } // end remote
        // }); // end new Bloodhound

        // suggests.initialize(); // initialise bloodhound suggestion engine

        //========================= END BLOODHOUND ==============================//

        //========================= TYPEAHEAD ==============================//
        // Instantiate the Typeahead UI
        // $('.typeahead').typeahead({
        //     hint: true,
        //     highlight: true,
        //     minLength: 2
        // }, { source: suggests.ttAdapter() }).on('typeahead:selected', function (obj, datum) {
        //     this.fetchMovieID(datum.id)
        // }.bind(this)); // END Instantiate the Typeahead UI
        //========================= END TYPEAHEAD ==============================//

    } // end component did mount function
}

export default myComponent;