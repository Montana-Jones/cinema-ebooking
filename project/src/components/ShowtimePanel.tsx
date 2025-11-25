"use client";
// src/components/ShowtimePanel.tsx

import React from "react";
import styles from "./Card.module.css";
import Link from "next/link";

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
      date: string;
    }[];
  };
  selectedDate?: string;   // <-- CHANGED: now a string, not Date
  showDate?: boolean;
}

const ShowtimePanel: React.FC<MovieProps> = ({ movie, selectedDate, showDate }) => {
  // Filter showtimes by exact date string (no timezone issues)
  const filteredShowtimes = movie.showtime.filter((s) => s.date === selectedDate);

  // Format header date
  const formattedDate =
    selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className={styles.showtimeContainer}>
      {showDate ? <h1>{formattedDate}</h1> : <h1>Showtimes</h1>}

      <div className={styles.showtimes}>
        {filteredShowtimes.map((sTime) => (
          <Link
            key={sTime.id}
            className={styles.showtimeButton}
            href={`/booking-nav/${selectedDate}/${sTime.id}`}
          >
            <p>{sTime.start_time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowtimePanel;
