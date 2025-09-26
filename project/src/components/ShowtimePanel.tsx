"use client";

import Image from "next/image";
import React from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Link from "next/link";
import Button from "./Button";

interface Showtime {
  id: number;
  movieId: number;
  theatreNum: number;
  startTime: Date;
}

interface MovieProps {
  movie: {
    _id: string;
    title: string;
    genre: string;
    mpaa_rating: string;
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

const ShowtimePanel: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className={styles.showtimeContainer}>
      <Button className={styles.showtimeButton} text="11:00am"></Button>
      <Button className={styles.showtimeButton} text="2:00pm"></Button>
      <Button className={styles.showtimeButton} text="5:00pm"></Button>
      <Button className={styles.showtimeButton} text="8:00pm"></Button>
      <Button className={styles.showtimeButton} text="11:00pm"></Button>
    </div>
  );
};

export default ShowtimePanel;
