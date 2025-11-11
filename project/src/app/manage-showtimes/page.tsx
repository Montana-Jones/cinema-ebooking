"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MoviePreview from "@/components/MoviePreview"; // adjust the path
import { MovieProps } from "@/components/Movie";

const ManageShowtimesPage: React.FC = () => {
  const [movies, setMovies] = useState<MovieProps["movie"][]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Showtimes</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MoviePreview movie={movie} href={`/manage-showtimes/${movie.id}`} />
        ))}
      </div>
    </div>
  );
};

export default ManageShowtimesPage;
