"use client";

import styles from "@/components/Card.module.css";

import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function Home() {
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
    return <div>Loading movies...</div>;
  }

  return (
    <main>
      <Navbar />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          {filteredMovies.map((movie) => (
            <MoviePreview key={movie._id} movie={movie} />
          ))}
        </div>
      </div>
    </main>
  );
}


/*
"use client";

import styles from "@/components/Card.module.css";

import React, { useState } from "react";
import Movie from "@/components/Movie";
import MoviePreview from "@/components/MoviePreview";
import dummyMovies from "@/data/DummyMovies";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";

export default function Home() {
  const [showNowShowing, setShowNowShowing] = useState(true);

  // Filter movies based on toggle
  const filteredMovies = dummyMovies.filter((movie) =>
    showNowShowing ? movie.now_showing : movie.coming_soon
  );

  return (
    <main>
      <Navbar />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          {filteredMovies.map((movie) => (
            <MoviePreview key={movie._id} movie={movie} />
          ))}
        </div>
        {/* {dummyMovies.map((movie, index) => (
          <Movie key={index} movie={movie} />
        ))} }
      </div>
    </main>
  );
}

{
}
*/