import Dashboard from './Dashboard/Dashboard';
import Preferences from './Preferences/Preferences';
import MediaDirectory from './MediaDirectory/MediaDirectory';
import RemoteUrlUpload from './RemoteUrlUpload/RemoteUrlUpload';
import PlaylistComponent from './Playlist/playlistComponent';
import PlaylistDetails from './Playlist/playlistDetails';
import CreateNewRemoteUrlUpload from './RemoteUrlUpload/CreateNewRequest';
import CreateMovieByImdb from './CreateMovie/CreateMovieByImdb';

import DashboardIcon from '@material-ui/icons/Dashboard';
import MovieIcon from '@material-ui/icons/Movie';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
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
        icon: ShoppingCartIcon,
        hide: true
    },
    {
        path: '/movies',
        sidebarName: 'Media Items',
        component: MediaDirectory,
        icon: MovieIcon
    },
    {
        path: '/remoteuploads',
        sidebarName: 'Remote Url Upload',
        component: RemoteUrlUpload,
        icon: CloudUploadIcon
    },
    {
        path: '/createremoteuploads',
        sidebarName: 'New Remote Url Upload',
        component: CreateNewRemoteUrlUpload,
        icon: AddIcon
    },
    {
        path: '/playlist',
        sidebarName: 'Playlist',
        component: PlaylistComponent,
        icon: SubscriptionsIcon
    },
    {
        path: '/playlistdetails/:id',
        sidebarName: 'Playlist',
        component: PlaylistComponent,
        icon: SubscriptionsIcon,
        hide: true
    },
    {
        path: '/movie/new',
        sidebarName: 'New Movie by IMDB Id',
        component: CreateMovieByImdb,
        icon: ShoppingCartIcon,
        hide: true
    }
];

export default Routes;