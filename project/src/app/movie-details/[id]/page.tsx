"use client";

import dummyMovies from "@/data/DummyMovies";
import React from "react";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";

interface MoviePageProps {
  params: { id: string };
}

export default function MoviePage({ params }: MoviePageProps) {
  const movie = dummyMovies.find((m) => m._id === params.id);

  if (!movie) return <p>Movie not found.</p>;

  return (
    <main
      style={{
        padding: "0 0 4rem 0", // top: 0, sides: 2rem, bottom: 2rem
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Movie movie={movie} />
    </main>
  );
}
