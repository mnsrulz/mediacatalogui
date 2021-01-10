import Dashboard from './Dashboard/Dashboard';
import Preferences from './Preferences/Preferences';
import MediaDirectory from './MediaDirectory/MediaDirectory';

import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';


const Routes = [
    {
        path: '/dashboard',
        sidebarName: 'Dashboard',
        component: Dashboard,
        icon: DashboardIcon
    },
    {
        path: '/preferences',
        sidebarName: 'Preferences',
        component: Preferences,
        icon: ShoppingCartIcon
    },    
    {
        path: '/movies',
        sidebarName: 'Movies',
        component: MediaDirectory,
        icon: ShoppingCartIcon
    },

];

export default Routes;