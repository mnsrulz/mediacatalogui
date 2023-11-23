import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    imdbRating: {
        float: 'right',
        fontFamily: "'Sen', sans-serif",
        backgroundColor: '#ff5dac',
        borderRadius: '0.5rem',
        padding: '2px 0.5rem',
        color: '#fff',
        marginBottom: '0.5rem',
    }
}));

export const ImdbRating = (props: { imdbId: string }) => {
    const classes = useStyles();
    const [rating, setRating] = useState('');
    const { ref, inView, entry } = useInView({
        /* Optional options */
        threshold: 0,
    });

    useEffect(() => {
        if (rating) return;
        const fn = async () => {
            const api = `https://imdbinfoapi.netlify.app/${props.imdbId}`
            const js = await axios<{ rating: string }>(api)
            setRating(js.data.rating);
        }
        if (props.imdbId && inView) {
            fn();
        }
    }, [props.imdbId, inView])
    if(rating)
    return <div ref={ref} className={classes.imdbRating}>
        {rating}
    </div>

    return <div ref={ref}></div>
}