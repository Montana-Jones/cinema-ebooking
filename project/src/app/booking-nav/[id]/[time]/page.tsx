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
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <h1 style={{ margin: "auto" }}>Replace this with the booking</h1>
    </main>
  );
}
