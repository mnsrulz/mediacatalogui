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
            let apiUrl = `${isTv ? 'tv' : 'movie'}/${tmdbId}?api_key=${apiKey}&language=en-US`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data.imdb_id;
        },
        search: async (q, isTv) => {
            let apiUrl = `search/${isTv ? 'tv' : 'movie'}?api_key=${apiKey}&language=en-US&&query=${encodeURIComponent(q)}`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data;
        }
    }
}
export const tmdbClient = AuthenticatedClient();