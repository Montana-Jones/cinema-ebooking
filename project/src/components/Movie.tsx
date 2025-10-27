"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Trailer from "./Trailer";
import ShowtimePanel from "./ShowtimePanel";
import Link from "next/link";

interface Showtime {
  id: number;
  movieId: number;
  theatreNum: number;
  startTime: Date;
}

export interface MovieProps {
  movie: {
    id: string;
    title: string;
    genre: string;
    mpaa_rating: string;
    rating: number; // a star rating between 0 and 5
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

const Movie: React.FC<MovieProps> = ({ movie }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get the user object from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log("Logged-in user:", user);
        if (user.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  return (
    <div>
      {/* Only show Edit button if user is admin */}
      {isAdmin && (
        <div className="flex justify-around mt-4">
          <Link
            href={`/movie-editor/${movie.id}`}
            className="w-fit text-lg bg-[#675068] text-white border-2 border-[#4c3b4d] rounded-full px-4 py-2 cursor-pointer hover:bg-[#4c3b4d] transition"
          >
            Edit Movie
          </Link>
        </div>
      )}

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
        </div>
      </Card>
    </div>
  );
};

export default Movie;
