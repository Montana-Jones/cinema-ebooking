
// src/app/selecting/[id]/page.tsx
"use client"; // add this line
import { useParams } from "next/navigation";
import Movie from "@/components/Movie";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";

interface Showtime {
  id: number;
  movieId: number;
  startTime: Date;
}

interface MovieP {
 
    _id: string;
    title: string;
    genre: string;
    mpaa_rating: string;
    rating: number; //a star rating between 0 and 5
    director: string; //list all directors in a single string
    producer: string; //list all producers in a single string
    cast: string; //list all major cast members in a single string
    synopsis: string;
    poster_url: string;
    trailer_url: string;
    now_showing: boolean;
    coming_soon: boolean;
    showtimes: Showtime[];

}
export default function SelectingPage() {
  const [movie, setMovie] = useState<MovieP | null>(null);
  const params = useParams();
  const { id } = params; // grabs the [id] from the URL
  

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Movie fetched:", data); // debug
        setMovie(data);
      })
      .catch((err) => console.error(err));
  },[id]);
  // const movie = dummyMovies.find((m) => m._id === id);

  if (!movie) {
    return <h1>Movie not found</h1>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      
         {/* Movie */}
      <Movie movie={movie} />

      {/* Book Now button */}
      <div style={{ marginTop: "1.5rem" }}>
        <Link href={`/booking/${id}`}>
            <button
                style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                }}
            >
                Book Now
            </button>
        </Link>
      </div>
     
    </main>
  );
}