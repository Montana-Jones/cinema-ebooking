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
      date: string; // e.g., "2023-10-15"
    }[];
  };
  selectedDate?: Date;
}

const ShowtimePanel: React.FC<MovieProps> = ({ movie, selectedDate }) => {
  // Filter showtimes to only include those for the selected date
  const filteredShowtimes = movie.showtime.filter((s) => {
  if (!selectedDate) return false;

  const year = selectedDate.getFullYear();
  const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = selectedDate.getDate().toString().padStart(2, "0");

  const localDateStr = `${year}-${month}-${day}`;
  return s.date === localDateStr;
});


  return (
    <div className={styles.showtimeContainer}>
      <h1>Showtimes</h1>
      <div className={styles.showtimes}>
        {filteredShowtimes.map((sTime) => (
          <Link
            key={sTime.id}
            className={styles.showtimeButton}
            href={`/booking-nav/${selectedDate?.toISOString().split("T")[0]}/${sTime.id}`}
          >
            <p>{sTime.start_time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowtimePanel;
