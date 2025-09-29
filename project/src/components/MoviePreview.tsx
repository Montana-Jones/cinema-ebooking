import React from "react";
import styles from "./Card.module.css";

interface MovieProps {
  movie: {
    id: string;
    title: string;
    nowShowing: boolean;
    comingSoon: boolean;
    posterUrl: string | null;
    trailerUrl: string | null;
    rating: number;
    genre: string;
  };
}


const MoviePreview: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className={styles.card}>
      {/* Poster */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={styles.posterPreview}
        />
      ) : (
        <div className={styles.noPoster}>No Image</div>
      )}
    </div>
  );
};

export default MoviePreview;
