"use client";
import React, { use, useEffect, useState } from "react";
import Movie from "@/components/Movie";
import Navbar from "@/components/Navbar";
import styles from "@/components/Card.module.css";
import MoviePreview from "@/components/MoviePreview";
import Image from "next/image";
import Link from "next/link";

import TheatreScreen from "@/assets/TheaterScreen.png";
import { useRouter } from "next/navigation";

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

interface Showroom {
  id: string;
  name: string;
  num_rows: number;
  num_cols: number;
  seat_binary: string;
}

interface Showtime {
  id: string;
  start_time: String;
  end_time: String;
  movie_id: String;
  room_name: string;
  seat_binary: string;
}

type Seat = {
  id: string;
  occupied: boolean;
};

export default function MoviePage({
  params,
}: {
  params: Promise<{ date: string; sTimeId: string }>;
}) {
  const { date, sTimeId } = use(params);
  const router = useRouter();
  const [movie, setMovie] = useState<MovieP | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [showroom, setShowroom] = useState<Showroom | null>(null);

  // 🆕 stores seat id and seat type
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; type: string }[]
  >([]);
  const [showSeatType, setShowSeatType] = useState<string | null>(null);

  const [rows, setRows] = useState<number>(5);
  const [cols, setCols] = useState<number>(12);
  const now = new Date(date);

  useEffect(() => {
    if (!sTimeId) return;
    fetch(`http://localhost:8080/api/showtimes/${sTimeId}`)
      .then((res) => res.json())
      .then((data) => {
        setShowtime(data);
      })
      .catch((err) => console.error(err));
  }, [sTimeId]);

  const movieId = showtime?.movie_id;

  useEffect(() => {
    if (!movieId) return;
    fetch(`http://localhost:8080/api/movies/${movieId}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      })
      .catch((err) => console.error(err));
  }, [movieId, sTimeId]);

  useEffect(() => {
    if (!showtime?.room_name) return;
    fetch(`http://localhost:8080/api/showrooms/roomname/${showtime.room_name}`)
      .then((res) => res.json())
      .then((data) => {
        setShowroom(data);
        setRows(data.num_rows);
        setCols(data.num_cols);
      })
      .catch((err) => console.error(err));
  }, [showtime?.room_name]);

  useEffect(() => {
    if (!showtime) return;
    const seatBinary =
      showtime.seat_binary ||
      Array.from({ length: rows * cols }, () => "0").join("");

    const seatB = seatBinary.split("");

    const generatedSeats = Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: cols }, (_, colIndex) => ({
        id: `${rowIndex}-${colIndex}`,
        occupied: seatB[rowIndex * cols + colIndex] === "1",
      }))
    );

    setSeats(generatedSeats);
  }, [showtime, rows, cols]);

  // upgraded toggle: open seat-type selector for adding, or remove if already selected
  const toggleSeat = (seatId: string | Seat) => {
    const id = typeof seatId === "string" ? seatId : seatId.id;
    const alreadySelected = selectedSeats.some((s) => s.id === id);
    if (alreadySelected) {
      // deselect
      setSelectedSeats((prev) => prev.filter((s) => s.id !== id));
      setShowSeatType(null);
    } else {
      // open seat type popup so user chooses type before adding
      setShowSeatType(id);
    }
  };

  const handleSeatTypeSelect = (seatId: string, type: string) => {
    setSelectedSeats((prev) => [...prev, { id: seatId, type }]);
    setShowSeatType(null);
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.occupied) return "#555";
    const seatInfo = selectedSeats.find((s) => s.id === seat.id);
    if (!seatInfo) return "#0af";

    switch (seatInfo.type) {
      case "ADULT":
        return "#f00";
      case "CHILD":
        return "#f00";
      case "SENIOR":
        return "#f00";
      default:
        return "#0af";
    }
  };
  const handleContinue = () => {
    if (selectedSeats.length === 0) return;

    // Encode seat objects as a URI-safe string
    const seatsParam = encodeURIComponent(JSON.stringify(selectedSeats));

    router.push(
      `/checkout?movieTitle=${encodeURIComponent(movie?.title || "")}` +
        `&showtimeId=${encodeURIComponent(showtime?.id || "")}` +
        `&startTime=${encodeURIComponent(
          showtime?.start_time?.toString() || ""
        )}` +
        `&seats=${seatsParam}` +`&cols=${encodeURIComponent(cols.toString())}`
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
          Time: {now.toLocaleDateString()} at{" "}
          {showtime ? showtime.start_time : ""}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {/* Poster */}
        <div style={{ flex: "0 0 auto" }}>
          <div className="ml-3">
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

        {/* Seat Grid */}
        <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
          <div>
            <div
              style={{ flex: "1", display: "flex", justifyContent: "center" }}
            >
              <Image
                src={TheatreScreen}
                alt="screen"
                style={{
                  width: "60%",
                  height: "auto",
                  margin: "1rem 0",
                  paddingRight: "4rem",
                }}
              />
            </div>

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
                    return (
                      <div key={seat.id} style={{ position: "relative" }}>
                        <div
                          onClick={() => !seat.occupied && toggleSeat(seat.id)}
                          style={{
                            width: "25px",
                            height: "25px",
                            margin: "3px",
                            backgroundColor: getSeatColor(seat),
                            cursor: seat.occupied ? "not-allowed" : "pointer",
                            borderRadius: "4px",
                            fontSize: ".7rem",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {seat.id}
                        </div>

                        {/* 🆕 Seat Type Popup */}
                        {showSeatType === seat.id && (
                          <div
                            style={{
                              position: "absolute",
                              top: "-80px",
                              left: "-30px",
                              background: "#0b0000ff",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              padding: "5px",
                              display: "flex",
                              flexDirection: "column",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                              zIndex: 10,
                            }}
                          >
                            {["ADULT", "CHILD", "SENIOR"].map((type) => (
                              <button
                                key={type}
                                onClick={() =>
                                  handleSeatTypeSelect(seat.id, type)
                                }
                                style={{
                                  margin: "2px",
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: "0 0 auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "1rem",
            width: "247px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            {" "}
            <div
              style={{
                width: "25px",
                height: "25px",
                margin: "3px",
                backgroundColor: "#555",
                borderRadius: "4px",
              }}
            />{" "}
            <span style={{ marginLeft: "8px" }}>Occupied</span>{" "}
          </div>{" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            {" "}
            <div
              style={{
                width: "25px",
                height: "25px",
                margin: "3px",
                backgroundColor: "#0af",
                borderRadius: "4px",
              }}
            />{" "}
            <span style={{ marginLeft: "8px" }}>Available</span>{" "}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            {" "}
            <div
              style={{
                width: "25px",
                height: "25px",
                margin: "3px",
                backgroundColor: "#f00",
                borderRadius: "4px",
              }}
            />{" "}
            <span style={{ marginLeft: "8px" }}>Selected</span>{" "}
          </div>{" "}
          <span>--------------</span>
          <h3>Selected Seats:</h3>
          {selectedSeats.length > 0 ? (
            <ul>
              {selectedSeats.map((s) => (
                <li key={s.id}>
                  {s.id} – {s.type}
                </li>
              ))}
            </ul>
          ) : (
            <p>None</p>
          )}
          <button
            disabled={selectedSeats.length === 0}
            onClick={handleContinue}
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
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
