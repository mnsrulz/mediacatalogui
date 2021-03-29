import React from 'react';
import { Grid, LinearProgress, CircularProgress } from '@material-ui/core';
import MovieCard from "../MediaCard/MediaCardComponent";
import { NewMovieCard } from '../MediaCard/NewMovieCard';


export const MediaCardListComponent = ({ items, isLoading }) => {
    
    // const [movies, setMovies] = React.useState(items);

    const deleteHandler = (mediaId) => {
        const moviesAfterRemove = items.filter(x=>x.id!=mediaId);
        // setMovies(moviesAfterRemove);        
    };
    const movieColumns = items ? items.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <NewMovieCard movie={movie}></NewMovieCard>
            {/* <MovieCard movie={movie} handleItemRemove={deleteHandler} /> */}
        </Grid>
    )) : null;
    if(isLoading){
        return <CircularProgress disableShrink />
    }
    else if (movieColumns?.length) {
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