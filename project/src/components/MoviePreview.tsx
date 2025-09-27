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
        <img src={movie.poster_url } alt={movie.title} className={styles.posterPreview} />
      ) : (
        <div className={styles.noPoster}>No Image</div>
      )} 
      
     
    </div>
  );
};

export default MoviePreview;
