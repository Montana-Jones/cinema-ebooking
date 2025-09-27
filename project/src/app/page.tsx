"use client";

import styles from "@/components/Card.module.css";
import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";
import Link from "next/link";

interface Movie {
  _id: string;
  title: string;
  genre: string;
  mpaa_rating: string | null;
  director: string;
  producer: string;
  cast: string;
  synopsis: string | null;
  description: string | null;
  poster_url: string | null;
  trailer_url: string | null;
  release_date: string | null;
  now_showing: boolean;
  coming_soon: boolean;
  showtimes: string[];
  rating: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Fetch movies from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter movies based on toggle and genre
  const filteredMovies = movies.filter((movie) => {
    const genreMatch =
      selectedGenre === "All" || movie.genre.includes(selectedGenre);
    const toggleMatch = showNowShowing ? movie.now_showing : movie.coming_soon;
    return genreMatch && toggleMatch;
  });

  return (
    <main>
      <Navbar selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          {filteredMovies.map((movie) => (
            <Link key={movie._id} href={`/selecting/${movie._id}`}>
              <MoviePreview movie={movie} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
