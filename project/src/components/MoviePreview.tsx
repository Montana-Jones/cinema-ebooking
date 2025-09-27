// MoviePreview.tsx
import React from "react";
import styles from "./Card.module.css";

interface MovieProps {
  movie: {
    _id: string;
    title: string;
    poster_url: string | null;
    trailer_url: string | null;
    rating: number;
    genre: string;
  };
}

const MoviePreview: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className={styles.card}>
      {/* Poster */}
      {movie.poster_url ? (
        <img src={movie.poster_url } alt={movie.title} className={styles.poster} />
      ) : (
        <div className={styles.noPoster}>No Image</div>
      )}

      {/* Title and Genre */}
      <h3>{movie.title}</h3>
      <p>{movie.genre}</p>

      {/* Rating */}
      <p>⭐ {movie.rating.toFixed(1)}</p>

      {/* Trailer Link */}
      {movie.trailer_url ? (
        <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer">
          Watch Trailer
        </a>
      ) : (
        <span>No Trailer</span>
      )}
    </div>
  );
};

export default MoviePreview;
