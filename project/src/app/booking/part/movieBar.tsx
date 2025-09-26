"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import movies from "@/data/DummyMovies"; 


type MovieBarProps = {
  movieId: string;
};

export default function MovieBar({ movieId }: MovieBarProps) {
  const movie = movies.find((m) => m._id === movieId);
    const now = new Date(); // current date & time
    

  if (!movie) return <div>Movie not found</div>;

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2 style={{ marginBottom: "0.5rem", fontSize: "1.25rem",fontWeight: 1000 }}>{movie.title}</h2>
      <p>Genre: {movie.genre}</p>
      <p>Date: {now.toLocaleDateString()}</p>
    </div>
  );
}