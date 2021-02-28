import axios from 'axios';

function AuthenticatedClient() {
    var _instance = axios.create({
        baseURL: 'https://mediacatalog.netlify.app/.netlify/functions/server/'
    });
    _instance.interceptors.request.use(config => {        
        const idToken = JSON.parse(localStorage.token).tokenId;
        config.headers.Authorization = 'Bearer ' + idToken;
        return config;
    });
    return _instance;
}

export const apiClient = AuthenticatedClient();