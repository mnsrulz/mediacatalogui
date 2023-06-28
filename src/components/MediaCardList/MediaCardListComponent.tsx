import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { NewMovieCard } from '../MediaCard/NewMovieCard';

interface CProps { items: any[], isLoading: boolean, playlistIdentifier?: string }

export const MediaCardListComponent = ({ items, isLoading, playlistIdentifier }: CProps) => {

    // const [movies, setMovies] = React.useState(items);

    // const deleteHandler = (mediaId) => {
    //     const moviesAfterRemove = items.filter(x => x.id != mediaId);
    //     // setMovies(moviesAfterRemove);        
    // };
    const movieColumns = items ? items.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <NewMovieCard movie={movie} playlistIdentifier={playlistIdentifier}></NewMovieCard>
            {/* <MovieCard movie={movie} handleItemRemove={deleteHandler} /> */}
        </Grid>
    )) : null;
    if (isLoading) {
        return <CircularProgress disableShrink />
    }
    else if (movieColumns?.length) {
        return (
            <Grid container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={3}>
                {movieColumns || "hello"}
            </Grid>
        );
    } else {
        return <div>No items found</div>
    }
}