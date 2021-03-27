import { Avatar, Box, Card, CardContent, CardHeader, CardMedia, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    card: {
        width: 360,
        height: 275,
        position: 'relative',
        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
        // overflow: 'visible',
        borderRadius: '1.5rem',
        transition: '0.4s',
        // '&:hover': {
        //     transform: 'translateY(-2px)',
        //     '& $shadow': {
        //         bottom: '-1.5rem',
        //     },
        //     '& $shadow2': {
        //         bottom: '-2.5rem',
        //     },
        // },
        // '&:before': {
        //     content: '""',
        //     position: 'absolute',
        //     zIndex: 0,
        //     display: 'block',
        //     width: '100%',
        //     bottom: -1,
        //     height: '100%',
        //     borderRadius: '1.5rem',
        //     backgroundColor: 'rgba(0,0,0,0.08)',
        // },
    },
    title: {
        fontFamily: "'Sen', sans-serif",
        fontSize: '1rem',
        fontWeight: 800,
        color: '#fff',
    },
    main: {
        height: 200,
        overflow: 'hidden',
        borderTopLeftRadius: '1.5rem',
        borderTopRightRadius: '1.5rem',
        zIndex: 1,
        '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to top, #014a7d, rgba(0,0,0,0))',
        },
    },
    content: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
        padding: '1.5rem 1.5rem 1rem',
    }, tag: {
        display: 'inline-block',
        fontFamily: "'Sen', sans-serif",
        backgroundColor: '#ff5dac',
        borderRadius: '0.5rem',
        padding: '2px 0.5rem',
        color: '#fff',
        marginBottom: '0.5rem',
    }, avatar: {
        width: 36,
        height: 36,
    }, author: {
        // zIndex: 1,
        position: 'relative',
        borderBottomLeftRadius: '1.5rem',
        borderBottomRightRadius: '1.5rem',
        backgroundColor: theme.palette.common.white
    },
    contentoverride: {
        overflow: 'hidden'
    },
    titleclass: {
        fontSize: '0.8rem',
        fontWeight: 500
    }
}));
export const MiniPoster = ({ posterPath, backpath, title, year, isTv }) => {
    const classes = useStyles();
    const calculatedBackdrop = () => {
        if (backpath)
            return `https://image.tmdb.org/t/p/w780/${backpath}`;
        else
            return `https://image.tmdb.org/t/p/w500${posterPath}`
    }
    const calculatedPosterPath = () => {
        return `https://image.tmdb.org/t/p/w92${posterPath}`
    }    
    return (
        <Card className={classes.card}>
            <Box className={classes.main} position={'relative'}>
                <CardMedia src={calculatedBackdrop()} component="img" />
                <div className={classes.content}>
                    <div className={classes.tag}>{isTv ? 'TV' : 'Movie'}</div>
                    <Typography variant={'h2'} className={classes.title}>
                        {title} ({year})
                    </Typography>
                </div>
            </Box>
            <CardHeader className={classes.author} classes={{
                content: classes.contentoverride,
                // title: classes.titleclass,
            }} avatar={<Avatar src={calculatedPosterPath()} />}
                title={title}
                subheader={year}
                titleTypographyProps={{ noWrap: true, gutterBottom: false }}
                subheaderTypographyProps={{ noWrap: true }}
            />
        </Card>
    )
}