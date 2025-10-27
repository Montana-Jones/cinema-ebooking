"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";

interface User {
  email: string;
  role: string;
}

interface Movie {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
}

export default function ManageMovies() {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch movies once user is confirmed to be admin
  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

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
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <Navbar />
        <p className="mb-6 text-lg">Access denied.</p>
        <Link href="/">
          <p className="bg-[#4c3b4d] border-3 border-[#675068] rounded-2xl px-4 py-3 text-lg font-medium cursor-pointer hover:bg-[#5d4561]">
            Go back home
          </p>
        </Link>
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete movie");
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
      alert("Movie deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting movie!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          className="flex flex-col justify-between bg-[#1f1f1f] rounded-2xl shadow-lg border border-gray-700 p-6 h-[250px]"
        >
          <div>
            <h2 className="text-xl font-bold mb-2">
              <Link
                href={`/movie-details/${movie.id}`}
                className="hover:underline text-[#75D1A6]"
              >
                {movie.title}
              </Link>
            </h2>
            <div className="space-y-1 text-gray-300">
              <p>
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p className="mt-2 text-[0.9rem] text-[#999] line-clamp-4 overflow-hidden">
                {movie.synopsis}
              </p>
            </div>
          </div>

          <div className="flex justify-around mt-4">
            <Link
              href={`/movie-editor/${movie.id}`}
              className="w-fit text-lg bg-[#675068] text-white border-2 border-[#4c3b4d] rounded-full px-4 py-2 cursor-pointer hover:bg-[#4c3b4d] transition"
            >
              Edit Movie
            </Link>
            <button
              onClick={() => handleDelete(movie.id, movie.title)}
              className="w-fit text-lg bg-[#b33a3a] border-2 border-[#801818] rounded-full px-4 py-2 cursor-pointer hover:bg-[#c44] transition"
            >
              Delete Movie
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
