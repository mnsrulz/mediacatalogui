import { useState } from "react";
import { MiniPoster } from "../MediaSourceList/MiniPoster";

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { PlaylistSelectionDialog } from '../MediaCard/PlaylistSelectionDialog';


export const NewMovieCard = ({ movie }) => {

    const [showPlaylistSelectionDialog, setShowPlaylistSelectionDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePlaylistMenuItemClick = () => {
        setAnchorEl(null);
        setShowPlaylistSelectionDialog(true)
    }
    const action = <div>
        <IconButton onClick={handleClick}>
            <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} >
            <MenuItem onClick={handlePlaylistMenuItemClick}>
                Save to Playlist
        </MenuItem>
        </Menu>
    </div>

    const playlistEl = <PlaylistSelectionDialog open={showPlaylistSelectionDialog} selectedPlaylist={movie.playlistIds.map(x=>x.playlistId)}
        mediaId={movie.id}
        onClose={() => { setShowPlaylistSelectionDialog(false) }}
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
    </div>
}