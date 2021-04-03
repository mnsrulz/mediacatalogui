import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistDetails } from './playlistDetails'
import { Playlist } from '../Playlist/playlist'
export const PlaylistPage = () => {
    let { id } = useParams();
    if (id) {
        return (
            <PlaylistDetails playlistId={id}></PlaylistDetails>
        );
    } else {
        return (
            <Playlist></Playlist>
        );
    }
}