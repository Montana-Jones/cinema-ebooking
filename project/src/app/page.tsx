"use client";

import styles from "@/components/Card.module.css";
import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  genre: string;
  mpaaRating: string | null;
  director: string;
  producer: string;
  cast: string;
  synopsis: string | null;
  description: string | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  releaseDate: string | null;   // ✅ fix: was release_date
  nowShowing: boolean;
  comingSoon: boolean;
  showtimes: string[];
  rating: number;
}


export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searched, setSearched] = useState("");

  // Fetch movies from backend
  useEffect(() => {
  fetch("http://localhost:8080/api/v1/movies")
    .then((res) => res.json())
    .then((data) => {
      const mapped = data.map((m: any) => ({
        id: m._id, // map _id → id
        title: m.title,
        genre: m.genre,
        mpaaRating: m.mpaaRating ?? "",
        director: m.director ?? "",
        producer: m.producer ?? "",
        cast: m.cast ?? "",
        synopsis: m.synopsis ?? "",
        description: m.description ?? "",
        posterUrl: m.posterUrl ?? null,
        trailerUrl: m.trailerUrl ?? null,
        release_date: m.releaseDate ?? null,
        nowShowing: m.nowShowing,
        comingSoon: m.comingSoon,
        showtimes: m.showtimes ?? [],
        rating: m.rating ?? 0,
      }));
      console.log("Movies mapped:", mapped);
      setMovies(mapped);
    })
    .catch((err) => console.error(err));
}, []);



  // Filter movies based on toggle and genre
  const filteredMovies = movies.filter((movie) => {
    const searchMatch = movie.title.toLowerCase().includes(searched.toLowerCase());    
    const genreMatch =
      selectedGenre === "All" || movie.genre.includes(selectedGenre);
    const toggleMatch = showNowShowing ? movie.nowShowing : movie.comingSoon;
    return genreMatch && toggleMatch && searchMatch;
  });



console.log("Filtered movies:", filteredMovies);
console.log("Number of filtered movies:", filteredMovies.length);
  return (
    <main>
      
      <Navbar selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} searched={searched} setSearched={setSearched} />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          
          {filteredMovies ? filteredMovies.map((m) => (
            <Link key={m.id} href={`/selecting/${m.id}`}>
              <MoviePreview movie={m} />
            </Link>
          )) : <p>No movies available. Try again!</p>}
        </div>
      </div>
    </main>
  );
}
