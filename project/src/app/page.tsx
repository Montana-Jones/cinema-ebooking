"use client";

import styles from "@/components/Card.module.css";
import React, { useState, useEffect } from "react";
import MoviePreview from "@/components/MoviePreview";
import Navbar from "@/components/Navbar";
import AddMovieButton from "@/components/AddMovieButton";
import ToggleSwitch from "@/components/ToggleSwitch";
import ShowtimePanel from "@/components/ShowtimePanel";

interface User {
  role: string;
}

interface DateItem {
  id: string;
  date: string; // e.g., "2023-10-15"
}

interface Showtime {
  id: string;
  start_time: string;
  end_time: string;
  movie_id: string;
  date: string; // e.g., "2023-10-15"
}

interface Movie {
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
  showtime: Showtime[];
}

export default function Home() {
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<DateItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch movies
  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies");
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

  // Fetch available dates
  useEffect(() => {
    fetch("http://localhost:8080/api/dates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dates");
        return res.json();
      })
      .then((data) => {
        setDates(data);
        if (data.length > 0) {
          setSelectedDate(data[0].date); // store as string YYYY-MM-DD
        }
      })
      .catch((err) => {
        console.error("Error fetching dates:", err);
      });
  }, []);

  // Filter movies based on toggle and selected date
  const filteredMovies = movies.filter((movie) => {
    const matchesToggle = showNowShowing ? movie.now_showing : movie.coming_soon;

    if (!matchesToggle) return false;

    if (showNowShowing && selectedDate) {
      // Filter for movies that have at least one showtime on selected date
      return movie.showtime?.some((sTime) => sTime.date === selectedDate) ?? false;
    }

    return true;
  });

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

      {/* Only show date selector when Now Showing is true */}
      {showNowShowing && (
        <div className={styles.daySelector}>
          <span className={styles.selectDayLabel}>Select Date:</span>
          {dates.map((d, i) => {
            const isSelected = selectedDate === d.date;

            const dateObj = new Date(d.date);

            return (
              <button
                key={i}
                className={`${styles.dayButton} ${
                  isSelected ? styles.selectedDay : ""
                }`}
                onClick={() => setSelectedDate(d.date)}
              >
                {dateObj.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </button>
            );
          })}
        </div>
      )}

      <div className={styles.moviePreviews}>
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <MoviePreview movie={movie} />
            {movie.now_showing && selectedDate && (
              <ShowtimePanel movie={movie} selectedDate={selectedDate} />
            )}
          </div>
        ))}
      </div>

      {user && user.role === "ADMIN" && <AddMovieButton />}
    </main>
  );
}
