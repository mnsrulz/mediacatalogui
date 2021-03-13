import React, { useState } from 'react';
import { Card, CardMedia, Typography, CardContent, CardActionArea, CardActions, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import ResponsiveDialog from '../Playlist/ResponsiveDialog';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

// These are inline styles
// You can pass styles as objects using this convention
const styles = {
  cardTitle: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  cardMedia: {
    maxHeight: 394,
    height: 169,
    overflow: 'hidden'
  },
  card: {
    cursor: 'pointer',
    overflow: 'hidden'
  },
  bgImage: {
    width: '100%'
  },
  cardSubtitle: {

  }
};


export default function MediaCardComponent({ movie, handleItemRemove }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(movie.favorite);

  const deleteHandler = async (result) => {
    if (result === 'Ok') {
      await apiClient.delete(`items/${movie.id}`);
      handleItemRemove(movie.id);
    }
    setShowDeleteDialog(false);
  };

  const setFavorteHandler = async () => {
    if (isFavorite) {
      await apiClient.delete(`items/${movie.id}/favorite`);
    } else {
      await apiClient.put(`items/${movie.id}/favorite`);
    }
    setIsFavorite(!isFavorite);
  };

  const posterImage = movie.backdropPath ? `https://image.tmdb.org/t/p/w300${movie.backdropPath}` : '';

  const favoritebar = isFavorite ?
    <FavoriteIcon style={{ color: 'red' }} /> :
    <FavoriteBorderOutlinedIcon style={{ color: 'red' }} />;

  return (
    <div>
      <ResponsiveDialog okButtonText="Yes"
        cancelButtonText="No"
        confirmText="Confirm Delete?"
        clickHandler={deleteHandler}
        open={showDeleteDialog}></ResponsiveDialog>
      <Card style={styles.card}>
        <CardActionArea>
          <CardMedia style={styles.cardMedia}>
            <img style={styles.bgImage} src={posterImage} />
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2" noWrap>
              {movie.title} - {movie.year}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="h2" noWrap style={styles.cardSubtitle}>
              {movie.tagline || "N/A"}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions disableSpacing>
          <IconButton onClick={setFavorteHandler}>
            {favoritebar}
          </IconButton>
          <IconButton onClick={() => setShowDeleteDialog(true)}>
            <DeleteIcon aria-label="delete"></DeleteIcon>
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
}
