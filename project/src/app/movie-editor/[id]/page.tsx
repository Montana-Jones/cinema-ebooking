"use client";

import MovieEditor from "@/components/MovieEditor";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import AccessDenied from "@/components/AccessDenied";
import Loading from "@/components/Loading";

interface MoviePageProps {
  params: { id: string };
}

interface User {
  role: string;
}

export default function MoviePage({ params }: MoviePageProps) {
  const { id } = params;

  const [user, setUser] = useState<User | null>(null);
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [movieLoading, setMovieLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, []);

  // Fetch movie
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setMovie(data);
        } else {
          setMovie(null);
        }
      } catch {
        setMovie(null);
      } finally {
        setMovieLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // If still loading user data
  if (loading || movieLoading) {
    return <Loading />;
  }

  // Admin validation
  if (!user || user.role !== "ADMIN") {
    return <AccessDenied />;
  }

  // Movie validation
  if (!movie) {
    return <p className="text-center text-white mt-10">Movie not found.</p>;
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
      <MovieEditor movie={movie} />
    </main>
  );
}