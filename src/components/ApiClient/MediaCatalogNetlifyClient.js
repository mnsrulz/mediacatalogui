import axios from 'axios';

function AuthenticatedClient() {
    const idToken = JSON.parse(localStorage.token).tokenId;
    return axios.create({
        baseURL: 'https://mediacatalog.netlify.app/.netlify/functions/server/',
        headers: {
            Authorization: 'Bearer ' + idToken
        }
    });
}

export const apiClient = AuthenticatedClient();