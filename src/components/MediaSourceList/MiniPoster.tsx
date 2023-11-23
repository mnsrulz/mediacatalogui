import { Avatar, Box, Card, CardHeader, CardMedia, Typography, Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react';

import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { ImdbRating } from '../ImdbRating/imdbRating';


const useStyles = makeStyles((theme) => ({
    card: {
        // width: 360,
        // height: 275,
        position: 'relative',
        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
        // overflow: 'visible',
        borderRadius: '1.5rem',
        transition: '0.4s',
        '&:hover': {
            transform: 'scale(1.02)',
            '& $shadow': {
                bottom: '-1.5rem',
            },
            '& $shadow2': {
                bottom: '-2.5rem',
            },
        },
        // '&:before': {
        //     content: '""',
        //     position: 'absolute',
        //     zIndex: 0,
        //     display: 'block',
        //     width: '100%',
        //     bottom: -1,
        //     height: '100%',
        //     borderRadius: '1.5rem',
        //     backgroundColor: 'rgba(0,0,0,0.08)',
        // },
    },
    title: {
        fontFamily: "'Sen', sans-serif",
        fontSize: '1rem',
        fontWeight: 800,
        color: '#fff',
    },
    main: {
        minHeight: 300,
        maxHeight: 385,
        overflow: 'hidden',
        borderTopLeftRadius: '1.5rem',
        borderTopRightRadius: '1.5rem',
        zIndex: 1,
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, #014a7d, rgba(0,0,0,0))',
        },
    },
    content: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
        padding: '1.5rem 1.5rem 1rem',
    }, tag: {
        display: 'inline-block',
        fontFamily: "'Sen', sans-serif",
        backgroundColor: '#ff5dac',
        borderRadius: '0.5rem',
        padding: '2px 0.5rem',
        color: '#fff',
        marginBottom: '0.5rem',
    }, avatar: {
        width: 36,
        height: 36,
    }, author: {
        // zIndex: 1,
        position: 'relative',
        borderBottomLeftRadius: '1.5rem',
        borderBottomRightRadius: '1.5rem',
        backgroundColor: theme.palette.common.white
    },
    contentoverride: {
        overflow: 'hidden'
    },
    titleclass: {
        fontSize: '0.8rem',
        fontWeight: 500
    }
}));

type tsss = {
    action?: any,
    mode?: 'portrait',
    backpath: string,
    posterPath: string,
    isTv: boolean,
    title: string,
    year: string,
    currentPlaylistId?: string,
    mediaId?: string,
    imdbId: string
}
export const MiniPoster = (props: tsss) => {
    const { mediaId, action, mode, backpath, posterPath, isTv, title, year, currentPlaylistId, imdbId } = props;
    const [isChecked, setIsChecked] = useState(true);
    const classes = useStyles();
    const calculatedBackdrop = () => {
        if (!posterPath && !backpath) return '';
        if (mode === 'portrait') {
            return `https://image.tmdb.org/t/p/w500${posterPath}`
        }

        if (backpath)
            return `https://image.tmdb.org/t/p/w780/${backpath}`;
        else
            return `https://image.tmdb.org/t/p/w500${posterPath}`
    }
    const calculatedPosterPath = () => {
        return posterPath ? `https://image.tmdb.org/t/p/w92${posterPath}` : ''
    }

    const togglePlaylist = async () => {
        const resource = `items/${mediaId}/playlists/${currentPlaylistId}`;
        if (isChecked) {
            setIsChecked(false);
            await apiClient.delete(resource);
        } else {
            setIsChecked(true);
            await apiClient.put(resource);
        }
    }

    const playListToggleElement = currentPlaylistId ? <Checkbox checked={isChecked}
        onClick={togglePlaylist}
        title={isChecked ? 'Remove from playlist' : 'Add to the playlist'}
        icon={<BookmarkBorderIcon />}
        checkedIcon={<BookmarkIcon />} />
        : <span />;

    return (
        <div>
            <Card className={classes.card}>
                <Box className={classes.main} position={'relative'}>
                    <CardMedia loading='lazy' src={calculatedBackdrop()} component="img" />
                    <div className={classes.content}>
                        <div className={classes.tag}>{isTv ? 'TV' : 'Movie'}</div>
                        <ImdbRating imdbId={imdbId}></ImdbRating>
                        {playListToggleElement}
                        <Typography variant={'h2'} className={classes.title}>
                            {title} ({year})
                        </Typography>
                    </div>
                </Box>
                <CardHeader className={classes.author} classes={{
                    content: classes.contentoverride
                }} avatar={<Avatar src={calculatedPosterPath()} imgProps={{ loading: 'lazy' }} />}
                    title={title}
                    subheader={year}
                    titleTypographyProps={{ noWrap: true, gutterBottom: false }}
                    subheaderTypographyProps={{ noWrap: true }}
                    action={action}
                />
            </Card>
        </div>
    )
}