
import React, { Component } from 'react';

// import './Card.scss';
import { Card, CardContent, Typography, CardMedia, CardHeader, Avatar, IconButton, Grid, Divider } from '@material-ui/core';
import { makeStyles, rgbToHex, withStyles } from '@material-ui/core/styles';

let numeral = require('numeral');
let backdropIMG;

const useStyles = makeStyles(theme => ({    
    card: {
        marginTop: '20px',
        display: 'flex',
        background: 'rgba(0,0,0,.85)'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
        color: 'white'
    },
    poster: {
        width: '100%',
        height: '480px'
    },
    tagline: {
        display: 'block',
        paddingBottom: '0.25em',
        color: 'limeGreen',
        fontSize: '1.3em'
    },
    metadata: {
        display: 'block',
        color: 'limeGreen',
    },
    additionalDetails: {
        margin: "35px 0 20px"
    }
}));

export default function MovCard({ data, test }) {
    const classes = useStyles();

    let posterIMG = 'https://image.tmdb.org/t/p/w500' + data.poster,
        production = data.production,
        productionCountries = data.production_countries,
        genres = data.genre,
        totalRevenue = data.revenue,
        productionList = nestedDataToString(production),
        productionCountriesList = nestedDataToString(productionCountries),
        noData = '-',
        genresList = nestedDataToString(genres);
    backdropIMG = 'https://image.tmdb.org/t/p/original' + data.backdrop;
    let rating = '';

    // conditional statements for no data
    if (data.vote === 'undefined' || data.vote === 0) {
        rating = noData
    } else {
        rating = data.vote
    };

    if (totalRevenue === 'undefined' || totalRevenue === 0) {
        totalRevenue = noData
    } else {
        totalRevenue = numeral(data.revenue).format('($0,0)');
    };

    if (data.poster == null) {
        posterIMG = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSols5HZxlQWyS9JY5d3_L9imbk0LiziHiyDtMZLHt_UNzoYUXs2g';
    }

    return (
        <div>
            {test}
            <Card className={classes.card}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>

                        <Typography component="h3" variant="h3">
                            {data.original_title}
                        </Typography>
                        <Typography component="h6" variant="h6" className={classes.tagline}>
                            {data.tagline}
                        </Typography>
                        <Typography variant="subtitle1">
                            {data.overview}
                        </Typography>

                        <Typography variant="subtitle1">
                            <Grid container className={classes.additionalDetails}>
                                <Grid item xs={6}>
                                    Original Release: <span className={classes.metadata}>{data.release}</span>
                                Box Office: <span className={classes.metadata}>{totalRevenue}</span>
                                </Grid>
                                <Grid item xs={6}>
                                    Running Time: <span className={classes.metadata}>{data.runtime} mins</span>
                                Rating: <span className={classes.metadata}>{rating}</span>
                                </Grid>
                            </Grid>
                        </Typography>
                    </CardContent>
                </div>
                <CardMedia image={posterIMG} title={data.original_title} className={classes.poster} />
            </Card>
        </div>
    );


    function nestedDataToString(nestedData) {
        let nestedArray = [],
            resultString;
        if (nestedData !== undefined) {
            nestedData.forEach(function (item) {
                nestedArray.push(item.name);
            });
        }
        resultString = nestedArray.join(', '); // array to string
        return resultString;
    };

}
