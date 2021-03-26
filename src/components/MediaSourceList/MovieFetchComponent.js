import { Avatar, Card, CardContent, CardMedia, Chip, Paper, Tooltip, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { tmdbClient } from '../ApiClient/TmdbClient'
import { SearchMovieDialog } from './SearchMovieDialog'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: 320,
        height: 162
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0.65
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        // width: 151,
        display: 'flex',
        flex: 0.35
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        padding: 0,
        fontSize: 11,
    },
}))(Tooltip);

export const MovieFetchComponent = ({ value, isTv, mediaSourceId, mediaItemId, handleMediaAssignment
}) => {
    //const posterSize = 'w185';  //w92
    const posterSize = 'w92';  //w92
    const [avatarUrl, setAvatarUrl] = useState('');
    const [title, setTitle] = useState(value);
    const [year, setYear] = useState('');
    const [overview, setOverview] = useState('');
    const [hasResult, setHasResult] = useState(false);
    const [result, setResult] = useState();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (!value) return;
        (async () => {
            const { results } = await tmdbClient.search(value, isTv);
            if (results[0]) {
                setHasResult(true);
                setResult(results[0]);
                setTitle(results[0].title || results[0].name);
                setAvatarUrl(`https://image.tmdb.org/t/p/${posterSize}${results[0].poster_path}`);
                setYear(results[0].release_date?.substr(0, 4) || results[0].first_air_date?.substr(0, 4));
                setOverview(results[0].overview);
            }
            setLoading(false);
        })();
    }, [value]);

    const deleteIcon = hasResult ? <DoneIcon /> : null
    const innerDeleteHandler = async () => {
        const { id } = result;
        await assigncurrentmedia(id, isTv);
    }

    const assigncurrentmedia = async (id, isthisitemtv) => {
        let mediaItemId;
        try {
            const response = await apiClient.get(`/items/byExternalId/${id}?type=tmdb`);
            mediaItemId = response.data.id;
        } catch (error) {
            const imdbId = await tmdbClient.findImdbId(id, isthisitemtv);
            console.log('imdbid', imdbId);
            const response = await apiClient.post(`items/byExternalId/${imdbId}?type=imdb`);
            mediaItemId = response.data.id;
        }
        await apiClient.put(`/mediasources/${mediaSourceId}/mediaItemId/${mediaItemId}`);
        handleMediaAssignment && handleMediaAssignment({ mediaItemId, mediaSourceId });
    }

    const showDialogHandler = () => {
        setShowDialog(true);
    }

    const handleSelectSearchDialog = async (outputofdialog) => {
        setShowDialog(false);
        if (outputofdialog) {
            await assigncurrentmedia(outputofdialog.id, outputofdialog.isTv);
        }
    }

    const miniPoster = <Card className={classes.root}>
        <div className={classes.details}>
            <CardContent className={classes.content}>
                <Typography>
                    {title} ({year})
                </Typography>
                <Typography lin variant="subtitle2" color="textSecondary" >
                    {overview}
                </Typography>
            </CardContent>
        </div>
        <CardMedia
            className={classes.cover}
            image={avatarUrl}
            title={title}
        />
    </Card>

    if (mediaItemId) {
        return <span>{mediaItemId}</span>
    } else if (loading) {
        return <div>Loading...</div>;
    }
    else {
        // return <span>hello</span>
        {/* <SearchMovieDialog show={showDialog}></SearchMovieDialog> */ }
        // <div>            </div>
        return <div>
            <SearchMovieDialog show={showDialog} query={title} isTv={isTv} handleSelect={handleSelectSearchDialog}></SearchMovieDialog>
            <LightTooltip interactive title={miniPoster} enterDelay={500} placement="right" arrow>
                <Chip
                    size='medium'
                    avatar={<Avatar src={avatarUrl} />}
                    color="primary" label={title}
                    variant="outlined"
                    onClick={showDialogHandler}
                    onDelete={hasResult ? innerDeleteHandler : null}
                    deleteIcon={deleteIcon}
                    clickable></Chip>
            </LightTooltip></div>
    }
}