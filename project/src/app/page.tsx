"use client";

import styles from "@/components/Card.module.css";
import React, { useState, useEffect } from "react";
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
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
          setSelectedDate(new Date(data[0].date));
      }
      })
      .catch((err) => {
        console.error("Error fetching dates:", err);
      });
  }, []);

  // Filter movies based on toggle
  const filteredMovies = movies.filter((movie) =>
  
    ((showNowShowing ? movie.now_showing : movie.coming_soon)
  && ((selectedDate && showNowShowing)? movie.showtime.some((sTime: any) => sTime.date === selectedDate.toISOString().split("T")[0]) : true ))
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

      {/* Only show date selector when Now Showing is true */}
      {showNowShowing && (
        <div className={styles.daySelector}>
          <span className={styles.selectDayLabel}>Select Date:</span>
          {dates.map((d, i) => {
            const date = new Date(d.date);
            
            const isSelected =
              selectedDate.toDateString() === date.toDateString();

            return (
              <button
                key={i}
                className={`${styles.dayButton} ${
                  isSelected ? styles.selectedDay : ""
                }`}
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
      )}

      <div className={styles.moviePreviews}>
        {filteredMovies.map((movie) => (
          <div key={movie.id}>
            <MoviePreview movie={movie} />
            {movie.now_showing && (
              <ShowtimePanel movie={movie} selectedDate={selectedDate} />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
