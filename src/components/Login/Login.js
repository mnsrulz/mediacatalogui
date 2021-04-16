import PropTypes from 'prop-types';
import React from 'react';
import {Avatar, CssBaseline, Box, Container} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';
import {Copyright} from '../Copyright/Copyright';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login({ setToken }) {
  const classes = useStyles();
  const responseGoogle = (res) => {    
    setToken(res);
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <GoogleLogin
          clientId="345350504609-1moo0gfi27h0jj2qaim5ed1iohgprs99.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          scope="profile email https://www.googleapis.com/auth/drive"
        />
      </div>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>    
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}