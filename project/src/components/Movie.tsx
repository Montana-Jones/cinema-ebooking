"use client";

import Image from "next/image";
import React from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Trailer from "./Trailer";
import ShowtimePanel from "./ShowtimePanel";

interface Showtime {
  id: number;
  movieId: number;
  theatreNum: number;
  startTime: Date;
}

interface MovieProps {
  movie: {
    id: string;
    title: string;
    genre: string;
    mpaaRating: string;
    rating: number; //a star rating between 0 and 5
    director: string; //list all directors in a single string
    producer: string; //list all producers in a single string
    cast: string; //list all major cast members in a single string
    synopsis: string;
    poster_url: string;
    trailer_url: string;
    now_showing: boolean;
    coming_soon: boolean;
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
      </div>
      <div className={styles.showtimesContainer}>
        {movie.now_showing ? "" : <ShowtimePanel movie={movie} />}
      </div>
    </Card>
  );
};

export default Movie;
