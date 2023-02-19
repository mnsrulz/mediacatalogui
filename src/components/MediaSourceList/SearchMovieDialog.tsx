import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, debounce, Tabs, Tab, MenuItem } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { tmdbClient, tmdbresult } from '../ApiClient/TmdbClient'
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

type SearchMovieDialogProps = {
    handleSelect: any,
    show: boolean,
    query: string,
    isTv: boolean
}

export const SearchMovieDialog = ({ handleSelect, show, query, isTv }: SearchMovieDialogProps) => {
    // const [open, setOpen] = useState(show);
    const [searchQuery, setSearchQuery] = useState(query);
    const [searchTv, setSearchTv] = useState(isTv);
    const [results, setResults] = useState<tmdbresult[]>([]);
    const [selectedId, setSelectedId] = useState(0);
    const [yearSelection, setyearSelection] = useState('All');
    const [isLoading, setIsLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

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

    const handleLoadMoreClick = () => {
        setPage(page + 1);
        loadItems();
    }

    const loadItems = async () => {
        setIsLoading(true);
        const searchResult = await tmdbClient.search(searchQuery, searchTv, yearSelection == 'All' ? '' : yearSelection, page);
        setResults(searchResult.results);
        //setResults([...results, ...searchResult.results]);    //some problems with this
        setTotalPages(searchResult.total_pages);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!searchQuery || !show) return;
        loadItems();
    }, [searchQuery, show, searchTv, yearSelection, page]);

    const [value, setValue] = useState(isTv ? 1 : 0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
        setSearchTv(newValue === 1);
        setSelectedId(0);
        setPage(1);
    };

    const handleSearchChange = (v: string) => {
        setResults([]);
        setPage(1);
        setTotalPages(0);
        setSearchQuery(v);
    }

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
                    handlePendingSelectionChange={setyearSelection}
                    defaultValue={searchQuery}
                    showSearchIcon={false}
                    onInputChange={handleSearchChange} >
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
                                    secondary={(value.release_date || value.first_air_date)?.substring(0, 4)} />
                            </ListItem>)
                        })}
                        {
                            isLoading && (<ListItem><ListItemText primary='Loading...' /></ListItem>)
                        }
                        {
                            !isLoading && totalPages > page && (
                                <ListItem button key={`load-more-${page}`} onClick={handleLoadMoreClick}>
                                    <ListItemText primary='Load More...' />
                                </ListItem>
                            )
                        }
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