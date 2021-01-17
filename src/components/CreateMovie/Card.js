
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
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    content: {
        flex: '1 0 auto',
        color: 'white',
        backgroundImage: 'linear-gradient(rgba(0,0,0,.85) 15%,rgba(0,0,0,.2) 40%,#000 90%)',
        minHeight: '500px'
    },
    posterContainer: {
        textAlign: 'center'
    },
    poster: {        
        width: '120px',
        [theme.breakpoints.up('md')]:{
            width: '200px'
        }
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

    const styleofbg = `url(${backdropIMG})`;

    return (
        <div>
            <Card className={classes.card}>
                <div className={classes.details} style={{ backgroundImage: styleofbg }}>
                    <CardContent className={classes.content}>
                        <Typography component="h3" variant="h3">
                            {data.original_title}
                        </Typography>
                        <Typography component="h6" variant="h6" className={classes.tagline}>
                            {data.tagline}
                        </Typography>
                        <Typography variant="subtitle1">
                            <Grid container>
                                <Grid item xs={9}>
                                    {data.overview}
                                    <Grid container className={classes.additionalDetails}>
                                        <Grid item md={3}>
                                            Original Release: <span className={classes.metadata}>{data.release}</span>
                                    Box Office: <span className={classes.metadata}>{totalRevenue}</span>
                                        </Grid>
                                        <Grid item md={3}>
                                            Running Time: <span className={classes.metadata}>{data.runtime} mins</span>
                                Rating: <span className={classes.metadata}>{rating}</span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3} className={classes.posterContainer}>
                                    <img src={posterIMG} className={classes.poster}></img>
                                    {/* <CardMedia image={posterIMG} title={data.original_title} className={classes.poster} /> */}
                                </Grid>
                            </Grid>
                        </Typography>
                    </CardContent>
                </div>
                {/* <CardMedia image={posterIMG} title={data.original_title} className={classes.poster} /> */}
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
