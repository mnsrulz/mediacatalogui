import { MiniPoster } from "../MediaSourceList/MiniPoster";

export const NewMovieCard = ({ movie }) => {
    return <MiniPoster backpath={movie.backdropPath}
        isTv={movie.itemType === 'tv'}
        posterPath={movie.posterPath}
        title={movie.title}
        year={movie.year}
        tagline={movie.tagline}
        mode="portrait"
    />
}