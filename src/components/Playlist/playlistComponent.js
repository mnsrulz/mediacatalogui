import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistDetails from '../Playlist/playlistDetails'
import Playlist from '../Playlist/playlist'
export default function MediaDirectory() {
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