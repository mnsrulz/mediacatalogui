import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemIcon, ListItemText, ListItem } from '@material-ui/core';
import { AppRoutes } from '../Routes';

export const SideNavBar = ({ location, handleSidebarSelection }:SideNavBarProps) => {
  const activeRoute = (routeName: string) => {
    return location === routeName ? true : false;
  }

  return (<div>
    <List>
      {AppRoutes.filter(x => !x.hide).map((prop, key) => {
        return (
          <ListItem component={Link} button
            to={prop.path}
            style={{ textDecoration: 'none' }}
            key={key}
            onClick={handleSidebarSelection}
            selected={activeRoute(prop.path)}>
            <ListItemIcon>
              <prop.icon />
            </ListItemIcon>
            <ListItemText primary={prop.sidebarName} />
          </ListItem >
        );
      })}
    </List>
  </div>);
}

type SideNavBarProps = { 
  location: string, 
  handleSidebarSelection: () => void 
}