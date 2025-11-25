"use client";

import Image from "next/image";
import React from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Trailer from "./Trailer";
import ShowtimePanel from "./ShowtimePanel";

interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
  movie_id: string;
  date: string;
}

interface MovieProps {
  movie: {
    id: string;
    title: string;
    genre: string;
    mpaa_rating: string;
    rating: number;
    director: string;
    producer: string;
    cast: string;
    synopsis: string;
    poster_url: string;
    trailer_url: string;
    now_showing: boolean;
    coming_soon: boolean;
    showtime: {
      id: string;
      start_time: string;
      end_time: string;
      movie_id: string;
      date: string; // e.g., "2023-10-15"
    }[];
  };
  selectedDate?: string;
}

const Movie: React.FC<MovieProps> = ({ movie }) => {
  return (
    <Card>
      <div className={styles.movieCard}>
        {/* Poster */}
        <div className={styles.posterWrapper}>
          <Image
            src={movie.poster_url}
            alt={movie.title}
            width={350}
            height={525}
            className={styles.poster}
          />
        </div>
        {/* Movie Info */}
        <div className={styles.movieInfo}>
          <h2 className={styles.title}>{movie.title}</h2>
          <div className={styles.movieType}>
            <p>
              <strong>Genre:</strong> {movie.genre}
            </p>
            <p>
              <strong>Rating:</strong> {movie.mpaa_rating}
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
          <div className={styles.trailerWrapper}>
            <Trailer trailerUrl={movie.trailer_url} />
          </div>
        </div>
        <div className={styles.showtimesContainer}>
  {movie.now_showing && (
    <>
      {[
        "2025-12-05",
        "2025-12-06",
        "2025-12-07",
      ].map((date) => {
        const hasShowtimes = movie.showtime.some((s) => s.date === date);

        if (!hasShowtimes) return null;

        return (
          <div key={date} className={styles.showtimeDayBlock}>
            <ShowtimePanel
              movie={movie}
              selectedDate={date}
              showDate={true}
            />
          </div>
        );
      })}
    </>
  )}
</div>


      </div>
    </Card>
  );
};

export default Movie;
