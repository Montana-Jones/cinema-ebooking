"use client";

import styles from "@/components/Card.module.css";

import React, { useState } from "react";
import Movie from "@/components/Movie";
import MoviePreview from "@/components/MoviePreview";
import dummyMovies from "@/data/DummyMovies";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import Navbar from "@/components/Navbar";
import ToggleSwitch from "@/components/ToggleSwitch";
import Link from "next/link";

export default function Home() {
  const [showNowShowing, setShowNowShowing] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All"); // for genre filtering
  // Filter movies based on toggle
  const filteredMovies = dummyMovies.filter((movie) => {
    
    const filteredGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre);
    return filteredGenre && (showNowShowing ? movie.now_showing : movie.coming_soon);

});

  return (
    <main>
      <Navbar 
      selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} 
      />
      <ToggleSwitch checked={showNowShowing} onChange={setShowNowShowing} />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          {filteredMovies.map((movie) => (
            <Link key={movie._id} href={`/selecting/${movie._id}`}>
              <MoviePreview movie={movie} />
            </Link>
          ))}
        </div>

         {/* {dummyMovies.map((movie, index) => (
          <Movie key={index} movie={movie} />
        ))}  */}
      </div> 
    </main>
  );
}

{
}
