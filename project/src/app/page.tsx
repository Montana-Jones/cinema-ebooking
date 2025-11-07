"use client";

import styles from "@/components/Card.module.css";

import React, { useState, useEffect, use } from "react";
import MoviePreview from "@/components/MoviePreview";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";
import ShowtimePanel from "@/components/ShowtimePanel";

interface Date {
  id: string;
  date: string; // e.g., "2023-10-15"
}

export default function Home() {
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDate] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    fetch("http://localhost:8080/api/dates") // backend endpoint for dates
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch dates");
        }
        return res.json();
      })
      .then((data) => {
        setDate(data);
      })
      .catch((err) => {
        console.error("Error fetching dates:", err);
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

      {/* Choose Day Option */}
      <div className={styles.daySelector}>
        <span className={styles.selectDayLabel}>Select Date:</span>
        {
         
          dates?.map((d, i) => {
          const date = new Date(d.date);
          const isSelected = selectedDate.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              className={`${styles.dayButton} ${isSelected ? styles.selectedDay : ""}`}
              onClick={() => setSelectedDate(date)}
            >
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </button>
          );
        })}
      </div>

      <div className={styles.moviePreviews}>
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <MoviePreview movie={movie} />
            {movie.now_showing && <ShowtimePanel movie={movie} selectedDate={selectedDate} />}
          </div>
        ))}
      </div>
    </main>
  );

}
