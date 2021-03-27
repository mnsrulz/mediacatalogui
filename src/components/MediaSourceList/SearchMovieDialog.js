import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, debounce, Tabs, Tab } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { tmdbClient } from '../ApiClient/TmdbClient'
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import MovieIcon from '@material-ui/icons/Movie';
import TvIcon from '@material-ui/icons/Tv';

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '80vh',
    }
}));


export function SearchMovieDialog({ handleSelect, show, query, isTv }) {
    // const [open, setOpen] = useState(show);
    const [searchQuery, setSearchQuery] = useState(query);
    const [searchTv, setSearchTv] = useState(isTv);
    const [results, setResults] = useState([]);
    const [selectedId, setSelectedId] = useState(0);

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

    const handleOnChange = (event) => {
        const { value } = event.target;
        setSearchQuery(value);
    };

    useEffect(() => {
        if (!searchQuery || !show) return;
        (async () => {
            console.log(searchTv);
            const { results } = await tmdbClient.search(searchQuery, searchTv);
            setResults(results);
        })();
    }, [searchQuery, show, searchTv]);

    const [value, setValue] = useState(isTv ? 1 : 0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setSearchTv(newValue === 1);
        setSelectedId(0);
    };

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
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    defaultValue={searchQuery}
                    fullWidth
                    onChange={debounce(handleOnChange, 250)}
                />

                {/* <FormControlLabel control={<Checkbox defaultChecked={searchTv}
                    onChange={handleSetTv} />} label="TV" /> */}
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