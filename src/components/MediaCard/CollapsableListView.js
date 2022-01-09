import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Backup from '@material-ui/icons/Backup';
import { Avatar, CircularProgress, IconButton, Icon, ListItemAvatar, ListItemSecondaryAction } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Progress from '@material-ui/icons/AddCircle';

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
        paddingRight: theme.spacing(1)
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

    const handleCopyClipboard = () => {
        navigator.clipboard.writeText(data.link);
    }

    const CopyToClipboardAction = () => {
        return <IconButton size={'small'}>
            <FileCopyIcon onClick={handleCopyClipboard} />
        </IconButton>
    }

    const SecondaryAction = () => {
        const { canExpand, loading } = data;
        if (canExpand) {
            if (loading) {
                return <IconButton disabled size='small'><CircularProgress size='1.5rem'/></IconButton>
            } else {
                return <IconButton size='small'>
                    {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
                </IconButton>
            }
        } else {
            /*to={`/playlistdetails/${id}`}*/
            const ctx = data._ctx;
            if (ctx) {
                const remoteUploadUrl = `/createremoteuploads?link=${encodeURIComponent(data.link)}&fileName=${encodeURIComponent(data.fileName)}&parent=${encodeURIComponent(data.parent)}&mediaId=${encodeURIComponent(ctx.mediaId)}`;
                return <IconButton size={'small'} component={Link}
                    to={remoteUploadUrl}><Backup /></IconButton>
            } else {
                return <div></div>
            }
        }
    }

    return (<List dense component="nav" disablePadding>
        <ListItem button onClick={handleClick}>
            <ListItemAvatar className={classes.avatarWrapper}>
                <Avatar className={classes.small}>{getAvatarText(data.link)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={data.name} />
            <ListItemSecondaryAction>
                <CopyToClipboardAction />
                <SecondaryAction />
            </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit className={classes.nested} >
            {
                data?.children?.map((item) => {
                    return <CollapsableListView key={item.link} data={item} handleToggle={handleToggle} />
                })
            }
        </Collapse>
    </List>
    )
}