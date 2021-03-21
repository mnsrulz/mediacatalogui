import { Avatar, Chip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useEffect, useState } from 'react'
import axios from 'axios'
export default function MovieFetchComponent({ value, isTv }) {
    const posterSize = 'w185';  //w92
    //const posterSize = 'w92';  //w92
    const [avatarUrl, setAvatarUrl] = useState('');
    const [title, setTitle] = useState(value);
    const [hasResult, setHasResult] = useState(false);
    
    useEffect(() => {
        if (!value) return;
        (async () => {
            if (isTv) {
                const apiurl = `https://api.themoviedb.org/3/search/tv?api_key=cfe422613b250f702980a3bbf9e90716&query=${encodeURIComponent(value)}`
                const apiresponse = await axios.get(apiurl);
                const { results } = apiresponse.data;
                if (results[0]) {
                    setHasResult(true);
                    setAvatarUrl(`https://image.tmdb.org/t/p/${posterSize}${results[0].poster_path}`);
                    setTitle(results[0].name);
                }
            } else {
                const apiurl = `https://api.themoviedb.org/3/search/movie?api_key=cfe422613b250f702980a3bbf9e90716&query=${encodeURIComponent(value)}`
                const apiresponse = await axios.get(apiurl);
                const { results } = apiresponse.data;
                if (results[0]) {
                    setHasResult(true);
                    setAvatarUrl(`https://image.tmdb.org/t/p/${posterSize}${results[0].poster_path}`);
                    setTitle(results[0].title);
                }
            }
        })();
    }, [value]);

    const deleteIcon = hasResult ? <DoneIcon /> : null
    const innerDeleteHandler = () => { alert('Ok, i will see if any other matches found for this title and ask you to confirm them apply as well') }
    
    return value ? <div><Chip
        size='medium'
        avatar={<Avatar src={avatarUrl} />}
        color="primary" label={title}
        variant="outlined"
        onClick={() => { alert('hello.. i will show you more to choose') }}
        onDelete={hasResult && innerDeleteHandler}
        deleteIcon={deleteIcon}
        clickable></Chip></div> : <div></div>;
}