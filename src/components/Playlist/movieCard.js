import React from 'react';
import { Card, CardMedia, Typography, CardContent, CardActionArea, Button, CardActions } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ResponsiveDialog from '../Playlist/ResponsiveDialog';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

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

class MovieCardComponent extends React.Component {
  constructor(props) {
    super(props);
    // Track if the mouse hovering over the movie card
    this.state = {
      showDeleteDialog: false,
      isMouseOver: false
    };
  }

  render() {
    const { movie, openMovieModal, handleItemRemove } = this.props;
    // The subtitle won't render if it's null
    const subtitle = this.state.isMouseOver ? movie.overview : null;

    const deleteHandler = async (result) => {

      if (result === 'Ok') {
        var headers = new Headers();
        const idToken = JSON.parse(localStorage.token).tokenId;
        headers.append('Authorization', 'Bearer ' + idToken);
        const apiUrl = `https://mediacatalog.netlify.app/.netlify/functions/server/items/${movie.id}`;
        const response = await fetch(apiUrl, { headers: headers, method: 'DELETE' });
        if (response.ok) {
          handleItemRemove(movie.id);
        } else {
          console.log('An error occurred while deleting the data...');
        }
      }
      this.setState({ showDeleteDialog: false });
    };

    return (
      <div>
        <ResponsiveDialog okButtonText="Yes"
          cancelButtonText="No"
          confirmText="Confirm Delete?"
          clickHandler={deleteHandler}
          open={this.state.showDeleteDialog}></ResponsiveDialog>
        <Card
          style={styles.card}
          onMouseOver={() => this.setState({ isMouseOver: true })}
          onMouseLeave={() => this.setState({ isMouseOver: false })}
        >
          <CardActionArea>
            <CardMedia
              style={styles.cardMedia}
            >
              <img style={styles.bgImage} src={`https://image.tmdb.org/t/p/w300${movie.backdropPath}`} />
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
            {/* <ToggleButtonGroup aria-label="text formatting">
              <ToggleButton value="bold" aria-label="bold">
                <FavoriteIcon />
              </ToggleButton>              
            </ToggleButtonGroup> */}
            <IconButton>
              <FavoriteIcon color="primary" />
              {/* <FavoriteBorder aria-label="remove from favorites"></FavoriteBorder> */}
            </IconButton>
            <IconButton onClick={() => this.setState({ showDeleteDialog: true })}>
              <DeleteIcon aria-label="delete"></DeleteIcon>
            </IconButton>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default MovieCardComponent;