import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField'
import { debounce, Menu, MenuItem, Paper } from '@material-ui/core';
import { MediaCardListComponent } from '../MediaCardList/MediaCardListComponent';

import { makeStyles } from '@material-ui/core/styles';
import { apiClient } from "../ApiClient/MediaCatalogNetlifyClient";
import { InputBase } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  searchbar: {
    marginBottom: theme.spacing(3),
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(3),
  }, input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const searchQuery = search;
      setLoading(true);
      const result = await apiClient.get(`items?q=${searchQuery}`, { signal: abortController.signal });
      if (search === searchQuery) {
        setData(result.data);
        setLoading(false);
      }
    })();
    return () => abortController.abort();
  }, [search]);

  return (
    <div>
      <Paper component="form" className={classes.root} >
        <InputBase className={classes.input} placeholder="Search"
          onChange={handleOnChange}
          defaultValue={search} />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton color="primary" className={classes.iconButton} aria-label="menu" onClick={handleClick}>
          <MenuIcon />
        </IconButton>
        {/* <Menu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={Boolean(anchorEl)} >
            <MenuItem onClick={()=>{console.log('hello')}}>
                Save to Playlist
            </MenuItem>
            <MenuItem onClick={()=>{console.log('hello')}}>
                View Sources
            </MenuItem>
        </Menu> */}
      </Paper>
      <MediaCardListComponent items={data} isLoading={loading}></MediaCardListComponent>
    </div>
  );
}