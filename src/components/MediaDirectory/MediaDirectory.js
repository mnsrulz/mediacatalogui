import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField'
import { debounce } from '@material-ui/core';
import MovieList from '../Playlist/movieList';

import { makeStyles } from '@material-ui/core/styles';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";

const useStyles = makeStyles((theme) => ({
  searchbar: {
    marginBottom: theme.spacing(3),
  },
}));

export default function MediaDirectory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const classes = useStyles();

  const handleOnChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  useEffect(() => {
    (async () => {
      const searchQuery = search;
      setLoading(true);
      const result = await apiClient.get(`items?q=${searchQuery}`);
      if (search === searchQuery) {
        setData(result.data);
        setLoading(false);
      }
    })();
  }, [search]);

  return (
    <div>
      <TextField label="Search" placeholder="Search" fullWidth
        onChange={debounce(handleOnChange, 250)} 
        defaultValue={search} className={classes.searchbar} />
      <MovieList items={data} isLoading={loading}></MovieList>
    </div>
  );
}