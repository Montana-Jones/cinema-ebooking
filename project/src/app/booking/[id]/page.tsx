// src/app/booking/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import MoviePreview from "@/components/MoviePreview";
import { useParams } from "next/navigation";
import TopBar from "@/app/booking/part/topBar";
import MovieBar from "@/app/booking/part/movieBar";
import TheatreScreen from "@/assets/TheaterScreen.png";
import Image from "next/image";
import Navbar from "@/components/Navbar";

interface MovieP {
  id: string;
  title: string;
  nowShowing: boolean;
  comingSoon: boolean;
  posterUrl: string | null;
  trailerUrl: string | null;
  rating: number;
  genre: string;
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

export default function SeatSelection() {
  const [movie, setMovie] = useState<MovieP | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const params = useParams();
  const { id } = params; // grabs the [id] from the URL

  useEffect(() => {
    fetch(`http://localhost:8080/api/movies/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Movie fetched:", data); // debug
        setMovie(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

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

  return (
    <main style={{ textAlign: "center" }}>
      <Navbar />
      <MovieBar movieId={typeof id === "string" ? id : ""} />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start", // align items to left
          alignItems: "flex-start", // top-align vertically
          gap: "2rem", // spacing between poster, seats, summary
        }}
      >
        {/* Poster */}
        <div style={{ flex: "0 0 auto" }}>
          {movie ? <MoviePreview movie={movie} /> : <h2>Loading movie...</h2>}
        </div>

        {/* Seat grid block */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <div>
            {/* Screen */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Image
                src={TheatreScreen}
                alt="screen"
                style={{ width: "144%", height: "auto", margin: "1rem 0" }}
              />
            </div>

            {/* Seats */}
            <div style={{ display: "inline-block" }}>
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
