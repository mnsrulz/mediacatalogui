import axios from 'axios';
const apiKey = 'cfe422613b250f702980a3bbf9e90716';
function AuthenticatedClient() {
    var _instance = axios.create({
        baseURL: 'https://api.themoviedb.org/3'
    });

    return {
        findMovie: (movieId: string) => {

        },
        findImdbId: async (tmdbId: string, isTv: boolean) => {
            let apiUrl = `${isTv ? 'tv' : 'movie'}/${tmdbId}?api_key=${apiKey}&language=en-US&append_to_response=external_ids`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data.external_ids.imdb_id;
        },
        search: async (q: string | number | boolean, isTv: boolean, year?: string) => {
            let apiUrl = `search/${isTv ? 'tv' : 'movie'}?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(q)}&year=${year}`;
            const resposne = await _instance.get(apiUrl);
            return resposne.data as tmdbresposetype;
        }
    }
}
export const tmdbClient = AuthenticatedClient();

export type tmdbresult = {
    id: number,
    title: string;
    name: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    first_air_date: string;
    overview: string;
}
export type tmdbresposetype = { results: tmdbresult[] };