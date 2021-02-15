import React from 'react';
import { Grid } from '@material-ui/core';
import MovieCard from '../Playlist/movieCard';

const MovieListComponent = ({ items }) => {
    
    const [movies, setMovies] = React.useState(items);

    const deleteHandler = (mediaId) => {
        const moviesAfterRemove = movies.filter(x=>x.id!=mediaId);
        setMovies(moviesAfterRemove);        
    };
    const movieColumns = movies ? movies.slice(0, 24).map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} handleItemRemove={deleteHandler} />
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