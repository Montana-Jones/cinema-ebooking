"use client";

import React, { useEffect, useState } from "react";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";

interface MoviePageProps {
  params: { id: string };
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/movies/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch movie");
        }
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  if (loading) {
    return <p>Loading movie...</p>;
  }

  if (!movie) {
    return <p>Movie not found.</p>;
  }

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
      {/* Replace with booking navigation later */}
      <h1 style={{ margin: "auto" }}>{movie.title}</h1>
      {/* You can also render <Movie movie={movie} /> here */}
    </main>
  );
}
