"use client";

import styles from "@/components/Card.module.css";

import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
import Navbar from "@/components/Navbar";
import AddMovie from "@/components/AddMovie";
import ToggleSwitch from "@/components/ToggleSwitch";
import ShowtimePanel from "@/components/ShowtimePanel";
import Link from "next/link";
import Image from "next/image";
import pencil from "@/assets/pencil.png";
import add from "@/assets/add.png";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser(); // get logged-in user
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies from backend
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/movies", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
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

  const filteredMovies = movies.filter((movie) =>
    showNowShowing ? movie.now_showing : movie.coming_soon
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="h-screen flex justify-center items-center">
          Loading movies...
        </div>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div className={styles.moviePreviews}>
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <MoviePreview movie={movie} />
            {movie.now_showing && <ShowtimePanel movie={movie} />}
          </div>
        ))}
      </div>
    </main>
  );
}
