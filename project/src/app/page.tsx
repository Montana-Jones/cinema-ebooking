"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";
import MoviePreview from "@/components/MoviePreview";
import dummyMovies from "@/data/DummyMovies";
import styles from "./globals.css";

export default function Home() {
  const [showNowShowing, setShowNowShowing] = useState(true);

  // Filter movies based on toggle
  const filteredMovies = dummyMovies.filter((movie) =>
    showNowShowing ? movie.now_showing : movie.coming_soon
  );

  return (
    <main style={{ padding: 0, margin: 0 }}>
      <Navbar />
      <div>
        <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {filteredMovies.map((movie) => (
          <MoviePreview key={movie._id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
