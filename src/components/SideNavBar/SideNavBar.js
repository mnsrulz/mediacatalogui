import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { List, ListItemIcon, ListItemText, ListItem } from '@material-ui/core';
import Routes from '../Routes';

const SideNavBar = (props) => {
  const activeRoute = (routeName) => {
    return props.location?.pathname === routeName ? true : false;
  }

  return (<div>
    <List>
      {Routes.filter(x => !x.hide).map((prop, key) => {
        return (
          <ListItem component={Link} button
            to={prop.navurl || prop.path}
            style={{ textDecoration: 'none' }}
            key={key}
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

export default withRouter(SideNavBar);