import React from 'react';
import { Grid } from '@material-ui/core';
import MovieCard from '../Playlist/movieCard';

const MovieListComponent = ({ movies }) => {
    const movieColumns = movies ? movies.map(movie => (
        <Grid item xs={12} sm={4} md={3} lg={3}>
            <MovieCard movie={movie} />
        </Grid>
    )) : null;
    if (movieColumns?.length) {
        return (
            <Grid container
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
                spacing={3}>
                {movieColumns || "hello"}
            </Grid>
        );
    } else {
        return <div>No items found</div>
    }
}

export default MovieListComponent;