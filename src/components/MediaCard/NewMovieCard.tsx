import { useState } from "react";
import { MiniPoster } from "../MediaSourceList/MiniPoster";

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PlaylistSelectionDialog } from './PlaylistSelectionDialog';
import { ViewSourceDialog, ViewExternalIdDialog, RefreshMediaSourcesDialog } from './ViewSourceDialog';
import React from "react";

interface MovieProps {
    movie: {
        id: any,
        title: string,
        tmdbId: string,
        imdbId: string
        backdropPath: string,
        itemType: string,
        posterPath: string,
        year: string,
        playlistIds: {
            playlistId: string
        }[],
        tagline: string,
    },
    playlistIdentifier?: string
}
export const NewMovieCard = ({ movie, playlistIdentifier }: MovieProps) => {

    const [showPlaylistSelectionDialog, setShowPlaylistSelectionDialog] = useState(false);
    const [showViewSourceDialog, setShowViewSourceDialog] = useState(false);
    const [showExternalIdDialog, setShowExternalIdDialog] = useState(false);
    const [showRefreshMediaSourcesDialog, setShowRefreshMediaSourcesDialog]= useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);

    const handlePlaylistMenuItemClick = () => {
        setAnchorEl(null);
        setShowPlaylistSelectionDialog(true)
    }

    const handleViewSourcesClick = () => {
        setAnchorEl(null);
        setShowViewSourceDialog(true);
    }

    const handleViewExternalIdsClick = () => {
        setAnchorEl(null);
        setShowExternalIdDialog(true);
    }

    const handleRefreshSourcesClick = () => {
        setAnchorEl(null);
        setShowRefreshMediaSourcesDialog(true);
    }

    const action = <div>
        <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
            <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} >
            <MenuItem onClick={handlePlaylistMenuItemClick}>
                Save to Playlist
            </MenuItem>
            <MenuItem onClick={handleViewSourcesClick}>
                View Sources
            </MenuItem>
            <MenuItem onClick={handleViewExternalIdsClick}>
                View External Ids
            </MenuItem>
            <MenuItem onClick={handleRefreshSourcesClick}>
                Refresh All Media sources
            </MenuItem>
        </Menu>
    </div>

    const playlistEl = <PlaylistSelectionDialog open={showPlaylistSelectionDialog} selectedPlaylist={movie.playlistIds.map(x => x.playlistId)}
        mediaId={movie.id}
        onClose={() => { setShowPlaylistSelectionDialog(false) }}
    />

    const showViewSourceEl = <ViewSourceDialog open={showViewSourceDialog}
        mediaId={movie.id}
        rootTitle={movie.title}
        onClose={() => { setShowViewSourceDialog(false) }}
    />

    const showViewExternalIdEl = <ViewExternalIdDialog open={showExternalIdDialog}
        mediaId={movie.id}
        rootTitle={movie.title}
        tmdbId={movie.tmdbId}
        imdbId={movie.imdbId}
        onClose={() => { setShowExternalIdDialog(false) }}
    />

    const showRefreshAllMediaSourceEl = <RefreshMediaSourcesDialog open={showRefreshMediaSourcesDialog} mediaId={movie.id} 
            onClose={() => { setShowRefreshMediaSourcesDialog(false) }}/>


    return <div>
        <MiniPoster backpath={movie.backdropPath}
            isTv={movie.itemType === 'tv'}
            posterPath={movie.posterPath}
            title={movie.title}
            year={movie.year}
            mode="portrait"
            action={action}
            currentPlaylistId={playlistIdentifier}
            mediaId={movie.id}
            imdbId={movie.imdbId}
        />
        {playlistEl}
        {showViewSourceEl}
        {showViewExternalIdEl}
        {showRefreshAllMediaSourceEl}
    </div>
}