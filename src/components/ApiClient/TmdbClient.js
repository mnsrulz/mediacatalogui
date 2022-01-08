import axios from 'axios';
const apiKey = 'cfe422613b250f702980a3bbf9e90716';
function AuthenticatedClient() {
    var _instance = axios.create({
        baseURL: 'https://api.themoviedb.org/3'
    });

    return {
        findMovie: (movieId) => {

        },
        findImdbId: async (tmdbId, isTv) => {
            let apiUrl = `${isTv ? 'tv' : 'movie'}/${tmdbId}?api_key=${apiKey}&language=en-US&append_to_response=external_ids`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data.external_ids.imdb_id;
        },
        search: async (q, isTv, year) => {
            let apiUrl = `search/${isTv ? 'tv' : 'movie'}?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(q)}&year=${year}`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data;
        }
    }
}
export const tmdbClient = AuthenticatedClient();