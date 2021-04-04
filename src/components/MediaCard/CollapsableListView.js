import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Avatar, CircularProgress, ListItemAvatar } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',        
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(2)
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        fontSize: '0.75rem',

    },
    avatarWrapper: {
        minWidth: 0,
        paddingRight: theme.spacing(2)
    }
}));

export const CollapsableListView = ({ data, handleToggle }) => {

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const getAvatarText = (link) => {
        if (link) {
            const u = new URL(link);
            return u.host[0]?.toUpperCase();
        }
    }

    const handleClick = () => {
        setOpen(!open);
        if (data.loaded || data.loading) return;
        if (data.canExpand) handleToggle(data, open);
    };
    return (<List dense component="nav" disablePadding>
        <ListItem button onClick={handleClick}>
            <ListItemAvatar className={classes.avatarWrapper}>
                <Avatar className={classes.small}>{getAvatarText(data.link)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={data.name} />
            {data.loading && <CircularProgress size="1rem" />}
            {data.canExpand && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit className={classes.nested} >
            {
                data?.children?.map((item) => {
                    return <CollapsableListView data={item} handleToggle={handleToggle} />
                })
            }
        </Collapse>
    </List>
    )
}