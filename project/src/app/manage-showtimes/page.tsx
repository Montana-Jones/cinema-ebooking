"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AccessDenied from "@/components/AccessDenied";

interface User {
  email: string;
  role: string;
}

interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  movieId: string;
  movieName: string;
  roomName: string;
  seatBinary: string;
}

export default function ManageShowtimes() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [movies, setMovies] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(10);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [movieId, setMovieId] = useState("");
  const [roomName, setRoomName] = useState("");

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoadingUser(false);
  }, []);

  // Fetch movies & rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, roomsRes] = await Promise.all([
          fetch("http://localhost:8080/api/movies"),
          fetch("http://localhost:8080/api/showrooms"),
        ]);

        setMovies(await moviesRes.json());
        setRooms(await roomsRes.json());
      } catch (err) {
        console.error("Error loading movies or rooms:", err);
      }
    };

    fetchData();
  }, []);

  // Fetch showtimes once movies are loaded (for name matching)
  useEffect(() => {
    if (movies.length === 0) return;

    const fetchShowtimes = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/showtimes");
        const data = await res.json();

        const mapped: Showtime[] = data.map((s: any) => {
          const movie = movies.find(
            (m) =>
              String(m._id || m.id) ===
              String(s.movie_id || s.movieId)
          );

          return {
            id: s._id || s.id,
            startTime: s.start_time || s.startTime,
            endTime: s.end_time || s.endTime,
            date: s.date,
            movieId: s.movie_id || s.movieId,
            movieName: movie?.title || "Unknown",
            roomName: s.room_name || s.roomName,
            seatBinary: s.seat_binary || s.seatBinary || "",
          };
        });

        // sort by date, then by movie name, then by start time
        mapped.sort((a, b) => {
          // 1. Compare dates
          const d1 = new Date(a.date);
          const d2 = new Date(b.date);
          if (d1.getTime() !== d2.getTime()) {
            return d1.getTime() - d2.getTime();
          }

          // 2. Compare movie names
          const movieCompare = a.movieName.localeCompare(b.movieName);
          if (movieCompare !== 0) return movieCompare;

          // 3. Compare start times (optional, but makes it neat)
          return a.startTime.localeCompare(b.startTime);
        });

        setShowtimes(mapped);

        setLoading(false);
      } catch (err) {
        console.error("Error loading showtimes:", err);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movies]);

  if (loadingUser) return <p>Loading user...</p>;
  if (!user || user.role !== "ADMIN") {
      return (
        <AccessDenied />
      );
    }

  if (loading) return <p>Loading showtimes...</p>;

  // ----------------- ADD SHOWTIME -----------------
  const handleAddShowtime = async () => {
    if (!movieId || !roomName || !date) {
      alert("Please fill all fields.");
      return;
    }

    const startTime = `${String(startHour).padStart(2, "0")}:${String(
      startMinute
    ).padStart(2, "0")}`;
    const endTime = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    const startMin = startHour * 60 + startMinute;
    const endMin = endHour * 60 + endMinute;

    // basic validation
    if (endMin <= startMin) {
      alert("End time must be AFTER start time.");
      return;
    }

    // clash detection
    const clash = showtimes.some((s) => {
      if (s.date !== date || s.roomName !== roomName) return false;

      const [sh, sm] = s.startTime.split(":").map(Number);
      const [eh, em] = s.endTime.split(":").map(Number);
      const sMin = sh * 60 + sm;
      const eMin = eh * 60 + em;

      return startMin < eMin && endMin > sMin;
    });

    if (clash) {
      alert("Showtime conflicts with an existing one.");
      return;
    }

    // send to backend with snake_case keys
    try {
      const res = await fetch("http://localhost:8080/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          start_time: startTime,
          end_time: endTime,
          movie_id: movieId,
          room_name: roomName,
          seat_binary: "", // initialize empty
        }),
      });

      if (!res.ok) throw new Error("Failed to create showtime");

      const newShow = await res.json();
      const movie = movies.find(
        (m) => String(m._id || m.id) === String(movieId)
      );

      setShowtimes((prev) => [
        ...prev,
        {
          id: newShow.id || newShow._id,
          startTime: newShow.start_time || newShow.startTime,
          endTime: newShow.end_time || newShow.endTime,
          date: newShow.date,
          movieId: newShow.movie_id || newShow.movieId,
          movieName: movie?.title || "Unknown",
          roomName: newShow.room_name || newShow.roomName,
          seatBinary: newShow.seat_binary || "",
        },
      ]);

      alert("Showtime added!");

      // reset form
      setDate("");
      setMovieId("");
      setRoomName("");
      setStartHour(10);
      setStartMinute(0);
      setEndHour(12);
      setEndMinute(0);
    } catch (err: any) {
      alert("Error adding showtime: " + err.message);
    }
  };

  // ----------------- DELETE SHOWTIME -----------------
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this showtime?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/showtimes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.error || "Cannot delete showtime");
      }

      setShowtimes((prev) => prev.filter((s) => s.id !== id));
      alert("Showtime deleted.");
    } catch (err: any) {
      alert("Error deleting showtime: " + err.message);
    }
  };

  // ----------------- UI -----------------
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Navbar />
      <h1 className="text-3xl text-[#75D1A6] font-bold mb-6">Manage Showtimes</h1>

      {/* Add Form */}
      <div className="bg-[#1f1f1f] p-6 rounded-xl mt-16 mb-8 ml-4 mr-4">
        <h2 className="text-xl font-bold mb-4">Add Showtime</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-black px-3 py-2 rounded"
          />

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={23}
              value={startHour}
              onChange={(e) => setStartHour(+e.target.value)}
              className="w-16 px-2 py-1 text-black rounded"
            />
            :
            <input
              type="number"
              min={0}
              max={59}
              value={startMinute}
              onChange={(e) => setStartMinute(+e.target.value)}
              className="w-16 px-2 py-1 text-black rounded"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={23}
              value={endHour}
              onChange={(e) => setEndHour(+e.target.value)}
              className="w-16 px-2 py-1 text-black rounded"
            />
            :
            <input
              type="number"
              min={0}
              max={59}
              value={endMinute}
              onChange={(e) => setEndMinute(+e.target.value)}
              className="w-16 px-2 py-1 text-black rounded"
            />
          </div>

          <select
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="bg-[#1f1f1f] border px-3 py-2 rounded"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m._id || m.id} value={m._id || m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <select
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="bg-[#1f1f1f] border px-3 py-2 rounded"
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAddShowtime}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Add Showtime
          </button>
        </div>
      </div>

      {/* Showtimes Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-[#2a2a2a] text-[#75D1A6]">
              <th className="p-4 border">Date</th>
              <th className="p-4 border">Start</th>
              <th className="p-4 border">End</th>
              <th className="p-4 border">Movie</th>
              <th className="p-4 border">Room</th>
              <th className="p-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {showtimes.map((s) => (
              <tr key={s.id} className="hover:bg-[#2a2a2a] transition">
                <td className="p-4 border">{s.date}</td>
                <td className="p-4 border">{s.startTime}</td>
                <td className="p-4 border">{s.endTime}</td>
                <td className="p-4 border">{s.movieName}</td>
                <td className="p-4 border">{s.roomName}</td>
                <td className="p-4 border">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
