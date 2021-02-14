import React from 'react';
import { Card, CardMedia, Typography, CardContent, CardActionArea, Button, CardActions } from '@material-ui/core';

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
    overflow: 'hidden'
  },
  card: {
    cursor: 'pointer',
    height: 320,
    overflow: 'hidden'
  },
  bgImage: {
    width: '100%'
  }
};

class MovieCardComponent extends React.Component {
  constructor(props) {
    super(props);
    // Track if the mouse hovering over the movie card
    this.state = {
      isMouseOver: false
    };
  }

  render() {
    const { movie, openMovieModal } = this.props;
    // The subtitle won't render if it's null
    const subtitle = this.state.isMouseOver ? movie.overview : null;

    return (
      <Card
        style={styles.card}
        onMouseOver={() => this.setState({ isMouseOver: true })}
        onMouseLeave={() => this.setState({ isMouseOver: false })}
      >
        <CardActionArea>
          <CardMedia
            style={styles.cardMedia}
          >
            <img style={styles.bgImage} src="https://image.tmdb.org/t/p/w300/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg" />
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              {movie.title} - {movie.year}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              some description of the movie
          </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button size="small" color="primary">
            Share
        </Button>
          <Button size="small" color="primary">
            Learn More
        </Button>
        </CardActions>
      </Card>
    );
  }
}

export default MovieCardComponent;