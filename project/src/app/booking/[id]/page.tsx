"use client";
import React, { useEffect, useState } from "react";
import MoviePreview from "@/components/MoviePreview";
import { useParams } from "next/navigation";
import dummyMovies from "@/data/DummyMovies";
import TopBar from "@/app/booking/part/topBar";
import MovieBar from "@/app/booking/part/movieBar";
import TheatreScreen from "@/assets/TheaterScreen.png";
import Image from "next/image";

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
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const params = useParams();
  const { id } = params; // grabs the [id] from the URL

  const movie = dummyMovies.find((m) => m._id === id);

   useEffect(() => {
    // Generate seats only on client
    const newSeats = generateSeats();
    setSeats(newSeats);
  }, []);
  const toggleSeat = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <TopBar />
      <MovieBar movieId={typeof id === "string" ? id : ""} />
        <div
  style={{
    display: "flex",
    justifyContent: "center", // keeps things centered
    alignItems: "center",     // vertical alignment
    gap: "2rem",              // spacing between poster, seats, summary
  }}
>
  {/* Poster */}
  <div style={{ flex: "0 0 auto" }}>
    <MoviePreview movie={movie} />
  </div>

  {/* Seat grid block */}
  <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
    <div>
      {/* Screen */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Image
          src={TheatreScreen}
          alt="screen"
          style={{ width: "130%", height: "auto", margin: "1rem 0" }}
        />
      </div>

      {/* Seats */}
      <div style={{ display: "inline-block" }}>
        {seats.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
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
                  }}
                ></div>
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
      minWidth: "200px",
    }}
  >
    <h3>Selected Seats</h3>
    <p>{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
    <button
      disabled={selectedSeats.length === 0}
      style={{
        marginTop: "1rem",
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
</div>


    </main>
  );
}