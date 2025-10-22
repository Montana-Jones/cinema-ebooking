"use client";
//src/components/ShowtimePanel.tsx
import Image from "next/image";
import React from "react";
import styles from "./Card.module.css";
import Link from "next/link";

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
    mpaa_rating: string;
    rating: number; // star rating between 0 and 5
    director: string;
    producer: string;
    cast: string;
    synopsis: string;
    poster_url: string;
    trailer_url: string;
    now_showing: boolean;
    coming_soon: boolean;
    showtimes: Showtime[];
  };
}

const hardcodedShowtimes = ["11:00am", "2:00pm", "5:00pm", "8:00pm", "11:00pm"];

const ShowtimePanel: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className={styles.showtimeContainer}>
      <h1>Showtimes</h1>
      <div className={styles.showtimes}>
        {hardcodedShowtimes.map((time) => (
          <Link
            key={time}
            className={styles.showtimeButton}
            href={`/booking-nav/${movie.id}/${encodeURIComponent(time)}`}
          >
            <p>{time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowtimePanel;
