"use client";

import styles from "@/components/Card.module.css";

import React from "react";
import Movie from "@/components/Movie";
import MoviePreview from "@/components/MoviePreview";
import dummyMovies from "@/data/DummyMovies";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <div className={styles.movieScroll}>
          {dummyMovies.map((movie, index) => (
            <MoviePreview key={index} movie={movie} />
          ))}
        </div>
        {dummyMovies.map((movie, index) => (
          <Movie key={index} movie={movie} />
        ))}
      </div>
    </main>
  );
}

{
}
