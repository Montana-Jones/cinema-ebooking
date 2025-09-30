"use client";

import styles from "@/components/Card.module.css";
import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
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
  releaseDate: string | null; // ✅ fix: was release_date
  nowShowing: boolean;
  comingSoon: boolean;
  showtimes: string[];
  rating: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/movies") // backend endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }
        return res.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, []);

  // Filter movies based on toggle
  const filteredMovies = movies.filter((movie) =>
    showNowShowing ? movie.now_showing : movie.coming_soon
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div class="h-screen flex justify-center items-center">
          Loading movies...
        </div>
      </div>
    );
  }

  return (
    <main>
      <Navbar
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        searched={searched}
        setSearched={setSearched}
      />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {" "}
        <div>
          {filteredMovies.map((movie) => (
            <MoviePreview key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </main>
  );
}
