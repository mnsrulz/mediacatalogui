import { Avatar, Chip, IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { tmdbClient, tmdbresult } from '../ApiClient/TmdbClient'
import { SearchMovieDialog } from './SearchMovieDialog'
import { MiniPoster } from './MiniPoster';
import { SimilarMovieAssign } from './SimilarMovieAssign';
import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';

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
    posterMedia: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    removeIcon: {
        margin: theme.spacing(1),
    }
}));

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 1)',
        padding: 0,
        borderRadius: '1.5rem'
    },
}))(Tooltip);

type FCProps = {
    value: string, isTv: boolean, mediaSourceId: string, mediaItemId: string, handleMediaAssignment: any, handleMediaSourceWithdrawl: any
};

export const MovieFetchComponent: React.FC<FCProps> = ({ value, isTv, mediaSourceId, mediaItemId, handleMediaAssignment, handleMediaSourceWithdrawl
}) => {
    //const posterSize = 'w185';  //w92
    const avatarSize = 'w92';  //w92
    const posterSize = 'w185';  //w92
    const backdropSize = 'w300';  //w92
    const [avatarUrl, setAvatarUrl] = useState('');
    const [backdropPath, setBackdropPath] = useState('');
    const [posterPath, setPosterPath] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [title, setTitle] = useState(value);
    const [year, setYear] = useState('');
    const [imdbId, setImdbId] = useState('');
    const [overview, setOverview] = useState('');
    const [hasResult, setHasResult] = useState(false);
    const [result, setResult] = useState<tmdbresult>();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);

    const [similarMediaResults, setSimilarMediaResults] = useState<{
        renderedTitle: string,
        id: number
    }[]>([]);


    const [similarMediaItemShowDialog, setSimilarMediaItemShowDialog] = useState(false);

    useEffect(() => {
        if (!value) return;
        (async () => {
            const { results } = await tmdbClient.search(value, isTv);
            if (results[0]) {
                setHasResult(true);
                setResult(results[0]);
                setTitle(results[0].title || results[0].name);
                setAvatarUrl(`https://image.tmdb.org/t/p/${avatarSize}${results[0].poster_path}`);
                setPosterUrl(`https://image.tmdb.org/t/p/${posterSize}${results[0].poster_path}`);

                //https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg

                setBackdropPath(results[0].backdrop_path);
                setPosterPath(results[0].poster_path);



                setYear(results[0].release_date?.substr(0, 4) || results[0].first_air_date?.substr(0, 4));
                setOverview(results[0].overview);
            }
            setLoading(false);
        })();
    }, [value]);

    const deleteIcon = hasResult ? <DoneIcon /> : undefined
    const innerDeleteHandler = async () => {
        if (result?.id)
            await assigncurrentmedia(result.id, isTv);
    }

    const assigncurrentmedia = async (id: number, isthisitemtv: boolean) => {
        let mediaItemId;
        try {
            const response = await apiClient.get(`/items/byExternalId/${id}?type=tmdb`);
            mediaItemId = response.data.id;
        } catch (error) {
            const response = await apiClient.post(`items/byExternalId/${id}?type=tmdb&tmdbHint=${isthisitemtv ? 'tv' : 'movie'}`);
            mediaItemId = response.data.id;
        }
        await apiClient.put(`/mediasources/${mediaSourceId}/mediaItemId/${mediaItemId}`);
        handleMediaAssignment && handleMediaAssignment([{ mediaItemId, mediaSourceId }]);

        const similarMediaResponse = await apiClient.get(`mediasources?parsedTitle=${encodeURIComponent(value)}&onlyPendingMediaAssignment=true`);
        if (similarMediaResponse.data.items && similarMediaResponse.data.items.length > 0) {
            setSimilarMediaResults(similarMediaResponse.data.items);
            setSimilarMediaItemShowDialog(true);
        }
    }

    const showDialogHandler = () => {
        setShowDialog(true);
    }

    const handleSelectSearchDialog = async (outputofdialog: { id: number; isTv: boolean; }) => {
        setShowDialog(false);
        if (outputofdialog) {
            await assigncurrentmedia(outputofdialog.id, outputofdialog.isTv);
        }
    }

    const handleSelectAssignMovieDialog = (assignedItems: any[]) => {
        setSimilarMediaItemShowDialog(false);
        if (assignedItems) {
            const payloadToSend = assignedItems.map(mediaSourceId => { return { mediaItemId, mediaSourceId } });
            handleMediaAssignment && handleMediaAssignment(payloadToSend);
        }
    }

    const handleRemoveAssociation = async () => {
        await apiClient.delete(`mediasources/${mediaSourceId}/mediaItemId/${mediaItemId}`);
        handleMediaSourceWithdrawl(mediaSourceId);
    }

    const miniPoster = <MiniPoster title={title}
        backpath={backdropPath}
        isTv={isTv}
        year={year}
        posterPath={posterPath}
        imdbId={imdbId} />

    const chip = <Chip
        size='medium'
        avatar={<Avatar src={avatarUrl} />}
        color="primary" label={title || value}
        variant="outlined"
        onClick={showDialogHandler}
        onDelete={hasResult ? innerDeleteHandler : undefined}
        deleteIcon={deleteIcon}
        style={{ maxWidth: 240 }}
        clickable></Chip>

    if (mediaItemId) {
        return <div>
            <SimilarMovieAssign show={similarMediaItemShowDialog} mediaItemId={mediaItemId} query={value}
                items={similarMediaResults}
                handleSelect={handleSelectAssignMovieDialog} />
            <span>{mediaItemId}</span>
            <IconButton color="primary" aria-label="remove link" size="small" className={classes.removeIcon} onClick={handleRemoveAssociation}>
                <ClearIcon fontSize="small" />
            </IconButton>
        </div>
    } else if (loading) {
        return <div>Loading...</div>;
    }
    else if (hasResult) {
        return <div>
            {/* <div onClick={() => setSimilarMediaItemShowDialog(true)} > Show</div> */}
            <SearchMovieDialog show={showDialog} query={title} isTv={isTv} handleSelect={handleSelectSearchDialog} />
            <LightTooltip interactive title={miniPoster} enterDelay={500} placement="right" arrow>
                {chip}
            </LightTooltip></div>
    } else {
        return <div>
            <SearchMovieDialog show={showDialog} query={title || value} isTv={isTv} handleSelect={handleSelectSearchDialog} />
            {chip}
        </div>
    }
}