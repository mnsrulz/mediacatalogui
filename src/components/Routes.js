import Dashboard from './Dashboard/Dashboard';
import Preferences from './Preferences/Preferences';
import MediaDirectory from './MediaDirectory/MediaDirectory';
import { RemoteUrlUploadRequestList } from './RemoteUrlUpload/RemoteUrlUpload';
import { PlaylistPage } from './Playlist/playlistComponent';
import { CreateNewRequest } from './RemoteUrlUpload/CreateNewRequest';
import CreateMovieByImdb from './CreateMovie/CreateMovieByImdb';
import { MediaSourceListComponent } from './MediaSourceList/MediaSourceListComponent';

import DashboardIcon from '@material-ui/icons/Dashboard';
import MovieIcon from '@material-ui/icons/Movie';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

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
        path: '/remoteuploads/:requestId',
        sidebarName: 'Remote Url Upload',
        component: RemoteUrlUploadRequestList,
        icon: CloudUploadIcon,
        hide: true
    },
    {
        path: '/remoteuploads',
        sidebarName: 'Remote Url Upload',
        component: RemoteUrlUploadRequestList,
        icon: CloudUploadIcon
    },
    {
        path: '/createremoteuploads',
        sidebarName: 'New Remote Url Upload',
        component: CreateNewRequest,
        icon: AddIcon
    },
    {
        path: '/playlist',
        sidebarName: 'Playlist',
        component: PlaylistPage,
        icon: SubscriptionsIcon
    },
    {
        path: '/playlistdetails/:id',
        sidebarName: 'Playlist',
        component: PlaylistPage,
        icon: SubscriptionsIcon,
        hide: true
    },
    {
        path: '/movie/new',
        sidebarName: 'New Movie by IMDB Id',
        component: CreateMovieByImdb,
        icon: ShoppingCartIcon,
        hide: true
    },
    {
        path: '/source',
        sidebarName: 'Media Source',
        component: MediaSourceListComponent,
        icon: AccountTreeIcon
    }
];

export default Routes;