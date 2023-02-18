import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { SideNavBar } from '../SideNavBar/SideNavBar';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    }, drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },

}));

export const ResponsiveDrawer = ({ open, handleDrawerClose, hiddenDrawerVariant }: ResponsiveDrawerProp) => {
    const classes = useStyles();
    const handleClick = () => {

    };

    return (
        <Drawer variant={hiddenDrawerVariant ? "temporary" : "permanent"}
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }} open={open}>
            <div className={classes.toolbarIcon}>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <SideNavBar handleSidebarSelection={handleClick} location={''}></SideNavBar>
        </Drawer>
    )

}

type ResponsiveDrawerProp = {
    open: boolean,
    handleDrawerClose: () => void,
    hiddenDrawerVariant: boolean
}