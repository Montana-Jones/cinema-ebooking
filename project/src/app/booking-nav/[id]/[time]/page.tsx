"use client";

import React, { useEffect, useState } from "react";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";
import styles from "@/components/Card.module.css";
import MoviePreview from "@/components/MoviePreview";
import Image from "next/image";
import Link from "next/link";
import TheatreScreen from "@/assets/TheaterScreen.png";

interface MoviePageProps {
  params: { id: string; time: string };
}

interface MovieP {
  id: string;
  title: string;
  now_showing: boolean;
  coming_soon: boolean;
  poster_url: string;
  trailer_url: string | null;
  rating: number;
  genre: string;
  mpaa_rating: string;
}

type Seat = {
  id: string;
  occupied: boolean;
};

const rows = 10;
const cols = 12;

// Generate dummy seats
const generateSeats = (): Seat[][] => {
  return Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (_, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      occupied: Math.random() < 0.2, // 20% seats occupied
    }))
  );
};

export default function MoviePage({
  params,
}: {
  params: Promise<{ id: string; time: string }>;
}) {
  const [movie, setMovie] = useState<MovieP | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const { id, time } = React.use(params); // ✅ unwrap the Promise
  const now = new Date(); // current date & time
  const t = decodeURIComponent(time);

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Movie fetched:", data); // debug
        setMovie(data);
      })
      .catch((err) => console.error(err));
  }, [id, time]);

  useEffect(() => {
    // Generate seats only on client
    const newSeats = generateSeats();
    setSeats(newSeats);
  }, []);
  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

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

      <div
        style={{
          padding: "1rem",
          border: "1px solid #541919ff",
          borderRadius: "8px",
          alignSelf: "center",
          marginTop: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#3a0b0bff",
        }}
      >
        <p>
          Time: {now.toLocaleDateString()} at {t}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center", // keeps things centered
          alignItems: "center", // vertical alignment
          gap: "2rem", // spacing between poster, seats, summary
        }}
      >
        {/* Poster */}
        <div style={{ flex: "0 0 auto" }}>
          <div className={styles.moviePreview}>
            <Link
              href={`/movie-details/${movie.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Image
                src={movie.poster_url}
                alt={movie.title}
                width={300}
                height={350}
                className={styles.posterPreview}
              />
            </Link>
            <h2 className={styles.previewTitle}>{movie.title}</h2>
            <div className={styles.previewDetails}>
              <p>{movie.mpaa_rating}</p>
              <p>{movie.genre}</p>
            </div>
          </div>
        </div>

        {/* Seat grid block */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <div>
            {/* Screen */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src={TheatreScreen}
                alt="screen"
                style={{
                  width: "58%",
                  height: "auto",
                  margin: "1rem 0",
                  paddingRight: "4rem",
                }}
              />
            </div>

            {/* Seats */}
            <div style={{ display: "inline-block", paddingLeft: "10.5rem" }}>
              {seats.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  {row.map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <div
                        key={seat.id}
                        onClick={() => !seat.occupied && toggleSeat(seat.id)}
                        style={{
                          width: "25px",
                          height: "25px",
                          margin: "3px",
                          backgroundColor: seat.occupied
                            ? "#555"
                            : isSelected
                            ? "#f00"
                            : "#0af",
                          cursor: seat.occupied ? "not-allowed" : "pointer",
                          borderRadius: "4px",
                          fontSize: ".7rem",
                          fontWeight: "bold",
                        }}
                      >
                        {seat.id}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected seats + button */}
        <div
          style={{
            flex: "0 0 auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            width: "247px",
            minHeight: "400",
            position: "relative",
            overflow: "visible",
            zIndex: 1,
            display: "flex", // <-- make the block flex
            flexDirection: "column", // <-- stack items vertically
            alignItems: "center", // <-- center horizontally
          }}
        >
          {/* Legend */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  margin: "3px",
                  backgroundColor: "#555",
                  borderRadius: "4px",
                }}
              />
              <span style={{ marginLeft: "8px" }}>Occupied</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  margin: "3px",
                  backgroundColor: "#0af",
                  borderRadius: "4px",
                }}
              />
              <span style={{ marginLeft: "8px" }}>Available</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  margin: "3px",
                  backgroundColor: "#f00",
                  borderRadius: "4px",
                }}
              />
              <span style={{ marginLeft: "8px" }}>Selected</span>
            </div>
          </div>
          <span>--------------</span>
          <h3
            style={{
              marginBottom: "0.5rem",
              fontSize: "1.1rem",
              fontWeight: 1000,
            }}
          >
            Selected Seats:
          </h3>
          <p>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
          <button
            disabled={selectedSeats.length === 0}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={() => alert(`Seats booked: ${selectedSeats.join(", ")}`)}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
