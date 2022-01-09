import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, debounce, Tabs, Tab, MenuItem } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { tmdbClient } from '../ApiClient/TmdbClient'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MovieIcon from '@material-ui/icons/Movie';
import TvIcon from '@material-ui/icons/Tv';
import React from 'react';
import { InputWithDropdownComponent } from './InputWithDropdownComponent';

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    }
}));


export const SearchMovieDialog = ({ handleSelect, show, query, isTv }) => {
    // const [open, setOpen] = useState(show);
    const [searchQuery, setSearchQuery] = useState(query);
    const [searchTv, setSearchTv] = useState(isTv);
    const [results, setResults] = useState([]);
    const [selectedId, setSelectedId] = useState(0);
    const [yearSelection, setyearSelection] = useState('All');

    const classes = useStyles();
    //const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        handleSelect(null);
    };

    const handleItemSelectionClose = () => {
        handleSelect({
            id: selectedId,
            isTv: searchTv
        });
    };

    const handleOnChange = (value) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        if (!searchQuery || !show) return;
        (async () => {
            const { results } = await tmdbClient.search(searchQuery, searchTv, yearSelection == 'All' ? '' : yearSelection);
            setResults(results);
        })();
    }, [searchQuery, show, searchTv, yearSelection]);

    const [value, setValue] = useState(isTv ? 1 : 0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSearchTv(newValue === 1);
        setSelectedId(0);
    };

    const now = new Date().getUTCFullYear();
    const years = Array(now - (now - 100)).fill('').map((v, idx) => now - idx);

    return (<div>
        <Dialog open={show}
            fullWidth={true}
            classes={{ paper: classes.dialogPaper }}
            onClose={handleClose} aria-labelledby="form-dialog-title">
            {/* <DialogTitle id="form-dialog-title">Search</DialogTitle> */}
            <DialogTitle style={{ padding: 0 }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary">
                    <Tab icon={<MovieIcon />} label="MOVIES" />
                    <Tab icon={<TvIcon />} label="TV" />
                </Tabs>
            </DialogTitle>
            <DialogContent dividers>
                <InputWithDropdownComponent
                    pendingSelection={yearSelection}
                    handlePendingSelectionChange={v => setyearSelection(v)}
                    defaultValue={searchQuery}
                    showSearchIcon={false}
                    onInputChange={handleOnChange} >
                    <MenuItem value={'All'}>Year</MenuItem>
                    {
                        years.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)
                    }
                </InputWithDropdownComponent>

                {
                    results && (<List component="nav">
                        {results.map((value) => {
                            return (<ListItem
                                key={value.id}
                                button
                                selected={selectedId === value.id}
                                onClick={() => setSelectedId(value.id)}
                            >
                                <ListItemAvatar>
                                    <Avatar src={value.poster_path && `https://image.tmdb.org/t/p/w92${value.poster_path}`}></Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`${value.title || value.name}`}
                                    secondary={(value.release_date || value.first_air_date)?.substr(0, 4)} />
                            </ListItem>)
                        })}
                    </List>)
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleItemSelectionClose} color="primary" disabled={selectedId === 0}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    </div>);
}