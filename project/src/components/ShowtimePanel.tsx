"use client";
//src/components/ShowtimePanel.tsx
import Image from "next/image";
import React from "react";
import styles from "./Card.module.css";
import Link from "next/link";

// interface Showtime {
//   id: number;
//   movieId: number;
//   theatreNum: number;
//   startTime: Date;
// }

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
    showtime: {
      id: string;
      start_time: String;
      end_time: String;

    }[] ;
  };
  selectedDate?: Date;
}


const ShowtimePanel: React.FC<MovieProps> = ({ movie, selectedDate }) => {
  console.log("Showtimes:", JSON.stringify(movie.showtime, null, 2));


  return (
    
    <div className={styles.showtimeContainer}>
      <h1>Showtimes</h1>
      <div className={styles.showtimes}>
        {movie.showtime.map((sTime, index) => (
          <Link
            key={index}
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