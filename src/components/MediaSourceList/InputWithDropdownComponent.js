import React from 'react';
import { Divider, IconButton, InputBase, MenuItem, Paper, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    searchbar: {
        marginBottom: theme.spacing(3),
    },
    root: {
        padding: '2px 8px 2px 8px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing(1),
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: '8px 8px'
    },
    divider: {
        height: 32,
        marginLeft: theme.spacing(1)
    },
    searchDropdownSelect: {
        '&:focus': {
            backgroundColor: 'white'
        }
    },

}));

export const InputWithDropdownComponent = ({children, pendingSelection, handlePendingSelectionChange, onChange, defaultValue}) => {
    const classes = useStyles();
    return <Paper component="form" className={classes.root} >
        <Select
            variant='standard'            
            classes={{                
                select: classes.searchDropdownSelect
            }}
            value={pendingSelection}
            onChange={handlePendingSelectionChange}
        >
            {children}
        </Select>
        <Divider className={classes.divider} orientation="vertical" />
        <InputBase autoFocus className={classes.input} placeholder="Search"
            onChange={onChange}
            defaultValue={defaultValue} />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
        </IconButton>
    </Paper>

}