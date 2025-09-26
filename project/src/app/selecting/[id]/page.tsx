
// src/app/selecting/[id]/page.tsx
"use client"; // add this line
import { useParams } from "next/navigation";
import dummyMovies from "@/data/DummyMovies";
import Movie from "@/components/Movie";
import styles from "@/components/Card.module.css";

import Link from "next/link";

export default function SelectingPage() {
  const params = useParams();
  const { id } = params; // grabs the [id] from the URL

  const movie = dummyMovies.find((m) => m._id === id);

  if (!movie) {
    return <h1>Movie not found</h1>;
  }

  return (
    <main style={{ padding: "2rem" }}>
      
         {/* Movie */}
      <Movie movie={movie} />

      {/* Book Now button */}
      <div style={{ marginTop: "1.5rem" }}>
        <Link href={`/booking/${movie._id}`}>
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