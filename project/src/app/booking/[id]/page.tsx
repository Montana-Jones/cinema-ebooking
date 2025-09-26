"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/page.module.css";
import MoviePreview from "@/components/MoviePreview";
import Movie from "@/components/Movie";
import GenreBar from "@/components/GenreBar";
import SearchBar from "@/components/SearchBar";
import { useParams } from "next/navigation";
import dummyMovies from "@/data/DummyMovies";
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
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Select Seats</h1>
      <div style={{ margin: "1rem 0" }}>SCREEN</div>

      <div style={{ display: "inline-block" }}>
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
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
                  }}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button
          disabled={selectedSeats.length === 0}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: selectedSeats.length === 0 ? "not-allowed" : "pointer",
          }}
          onClick={() => alert(`Seats booked: ${selectedSeats.join(", ")}`)}
        >
          Continue
        </button>
      </div>
    </main>
  );
}