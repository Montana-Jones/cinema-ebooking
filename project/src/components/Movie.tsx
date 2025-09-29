"use client";

import Image from "next/image";
import React from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Trailer from "./Trailer";

interface Showtime {
  id: number;
  movieId: number;
  startTime: Date;
}

interface MovieProps {
  movie: {
    id: string;
    title: string;
    genre: string;
    mpaaRating: string | null;
    rating: number;
    director: string;
    producer: string;
    cast: string;
    synopsis: string | null;
    posterUrl: string | null;
    trailerUrl: string | null;
    nowShowing: boolean;
    comingSoon: boolean;
    showtimes: Showtime[];
  };
}


const Movie: React.FC<MovieProps> = ({ movie }) => {
  return (
    <Card>
      <div className={styles.movieCard}>
        {/* Poster */}
        <div className={styles.posterWrapper}>
          {movie.posterUrl ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              width={350}
              height={525}
              className={styles.poster}
            />
          ) : (
            <div className={styles.noPoster}>No Image</div>
          )}
        </div>


        {/* Movie Info */}
        <div className={styles.movieInfo}>
          <h2 className={styles.title}>{movie.title}</h2>
          <div className={styles.movieType}>
            <p>
              <strong>Genre:</strong> {movie.genre}
            </p>
            <p>
              <strong>Rating:</strong> {movie.mpaaRating}
            </p>
            <p>
              <strong>Stars:</strong> {movie.rating} ⭐
            </p>
          </div>

          <div className={styles.crew}>
            <p>
              <strong>Director:</strong> {movie.director}
            </p>
            <p>
              <strong>Producer:</strong> {movie.producer}
            </p>
          </div>
          <p>
            <strong>Cast:</strong> {movie.cast}
          </p>
          <p className={styles.synopsis}>
            <strong>Synopsis:</strong> {movie.synopsis}
          </p>

          {/* Trailer Link */}
          {movie.trailerUrl && (
            <div className={styles.trailerWrapper}>
              <Trailer trailerUrl={movie.trailerUrl} />
            </div>
          )}

        </div>
        <div className={styles.showtimes}></div>
      </div>
    </Card>
  );
};

export default Movie;
