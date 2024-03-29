import React from 'react';
import { ReactNodeLike } from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title(props: { children: ReactNodeLike }) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}
