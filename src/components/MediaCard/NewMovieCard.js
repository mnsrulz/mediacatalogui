import { useState } from "react";
import { MiniPoster } from "../MediaSourceList/MiniPoster";

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PlaylistSelectionDialog } from '../MediaCard/PlaylistSelectionDialog';
import { ViewSourceDialog } from '../MediaCard/ViewSourceDialog';


export const NewMovieCard = ({ movie }) => {

    const [showPlaylistSelectionDialog, setShowPlaylistSelectionDialog] = useState(false);
    const [showViewSourceDialog, setShowViewSourceDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePlaylistMenuItemClick = () => {
        setAnchorEl(null);
        setShowPlaylistSelectionDialog(true)
    }

    const handleViewSourcesClick = () => {
        setAnchorEl(null);
        setShowViewSourceDialog(true)
    }

    const action = <div>
        <IconButton onClick={handleClick}>
            <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} >
            <MenuItem onClick={handlePlaylistMenuItemClick}>
                Save to Playlist
            </MenuItem>
            <MenuItem onClick={handleViewSourcesClick}>
                View Sources
            </MenuItem>
        </Menu>
    </div>

    const playlistEl = <PlaylistSelectionDialog open={showPlaylistSelectionDialog} selectedPlaylist={movie.playlistIds.map(x=>x.playlistId)}
        mediaId={movie.id}
        onClose={() => { setShowPlaylistSelectionDialog(false) }}
    />

    const showViewSourceEl = <ViewSourceDialog open={showViewSourceDialog}
        mediaId={movie.id}
        onClose={() => { setShowViewSourceDialog(false) }}
    />


    return <div>
        <MiniPoster backpath={movie.backdropPath}
            isTv={movie.itemType === 'tv'}
            posterPath={movie.posterPath}
            title={movie.title}
            year={movie.year}
            tagline={movie.tagline}
            mediaItemId={movie.id}
            playlistIds={movie.playlistIds}
            mode="portrait"
            action={action}
        />
        {playlistEl}
        {showViewSourceEl}
    </div>
}