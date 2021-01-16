import Dashboard from './Dashboard/Dashboard';
import Preferences from './Preferences/Preferences';
import MediaDirectory from './MediaDirectory/MediaDirectory';
import RemoteUrlUpload from './RemoteUrlUpload/RemoteUrlUpload';
import CreateNewRemoteUrlUpload from './RemoteUrlUpload/CreateNewRequest';
import CreateMovieByImdb from './CreateMovie/CreateMovieByImdb';

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
    {
        path: '/remoteuploads',
        sidebarName: 'Remote Url Upload',
        component: RemoteUrlUpload,
        icon: ShoppingCartIcon
    },
    {
        path: '/createremoteuploads',
        sidebarName: 'New Remote Url Upload',
        component: CreateNewRemoteUrlUpload,
        icon: ShoppingCartIcon
    },
    {
        path: '/movie/new',
        sidebarName: 'New Movie by IMDB Id',
        component: CreateMovieByImdb,
        icon: ShoppingCartIcon
    }

];

export default Routes;