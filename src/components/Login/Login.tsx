import React from 'react';
import { Avatar, CssBaseline, Box, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { GoogleLogin } from 'react-google-login';
import { Copyright } from '../Copyright/Copyright';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { apiClient } from '../ApiClient/MediaCatalogNetlifyClient';
import { LoginProps } from '../App/tokenProps';
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

export default function Login({ setToken }: LoginProps) {
  const classes = useStyles();
  const handleLogin = (successfull: boolean) => {
    if (!successfull) throw new Error('invalid....');
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <GoogleLogin
          clientId="345350504609-1moo0gfi27h0jj2qaim5ed1iohgprs99.apps.googleusercontent.com"
          onSuccess={l => setToken({ tokenType: 'google', t: JSON.stringify(l) })}
          onFailure={l => setToken({ tokenType: 'none', t: '' })}
          cookiePolicy={'single_host_origin'}
          scope="profile email https://www.googleapis.com/auth/drive"
        />

        <Formik
          initialValues={{ username: 'test', password: '' }}
          onSubmit={(values, { setSubmitting }) => {
            //naive way of authenticating...
            const _token = btoa(values.username + ':' + values.password)
            localStorage.basicAuth = _token;
            apiClient('/playlists')
              .then(d => handleLogin(d.status === 200))
              .then(d => setToken({ tokenType: 'basic', t: _token }))
              .catch(() => localStorage.basicAuth = '')
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="username" />
              <ErrorMessage name="username" component="div" />
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <Box mt={8}>
        <Copyright />
      </Box>
    </Container >
  )
}
