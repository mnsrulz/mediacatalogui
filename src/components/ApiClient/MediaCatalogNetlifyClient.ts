import axios from 'axios';

function AuthenticatedClient() {
    var _instance = axios.create({
        baseURL: 'https://mediacatalog.deno.dev/api/'
    });
    _instance.interceptors.request.use(config => {
        if (localStorage.token && JSON.parse(localStorage.token).tokenId) {
            const idToken = JSON.parse(localStorage.token).tokenId;
            config.headers.Authorization = 'Bearer ' + idToken;
        } else if(localStorage.basicAuth) {
            config.headers.Authorization = `Basic ${localStorage.basicAuth}`;
        }
        return config;
    });
    return _instance;
}

export const apiClient = AuthenticatedClient();