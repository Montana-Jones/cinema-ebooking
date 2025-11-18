"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

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
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(10);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [movieId, setMovieId] = useState("");
  const [roomName, setRoomName] = useState("");

  const [movies, setMovies] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoadingUser(false);
  }, []);

  // Fetch movies and rooms
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Error fetching movies:", err);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/showrooms");
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchMovies();
    fetchRooms();
  }, []);

  // Fetch showtimes after movies are loaded
  useEffect(() => {
    if (movies.length === 0) return;

    const fetchShowtimes = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/showtimes");
        const data = await res.json();

        const mappedShowtimes: Showtime[] = data.map((s: any) => {
          const movie = movies.find(
            (m) => String(m.id) === String(s.movie_id || s.movieId)
          );

          return {
            id: s._id ?? crypto.randomUUID(), // fallback if _id missing
            startTime: s.start_time || s.startTime,
            endTime: s.end_time || s.endTime,
            date: s.date,
            movieId: s.movie_id || s.movieId,
            movieName: movie?.title || "Unknown",
            roomName: s.room_name || s.roomName,
            seatBinary: s.seat_binary || s.seatBinary || "",
          };
        });

        setShowtimes(mappedShowtimes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movies]);

  // Admin access control
  if (loadingUser) return <p>Loading user info...</p>;
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <Navbar />
        <p className="mb-6 text-lg text-red-500">
          Access denied. Only admins can view this page.
        </p>
        <a
          href="/"
          className="bg-[#4c3b4d] border-3 border-[#675068] rounded-2xl px-4 py-3 text-lg font-medium cursor-pointer hover:bg-[#5d4561]"
        >
          Go back home
        </a>
      </div>
    );
  }

  if (loading) return <p>Loading showtimes...</p>;

  // Add showtime with clash detection
  const handleAddShowtime = async () => {
    if (!movieId || !roomName || !date) {
      alert("Please select movie, room, and date");
      return;
    }

    const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute
      .toString()
      .padStart(2, "0")}`;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    // Convert times to minutes for easy comparison
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      alert("End time must be after start time");
      return;
    }

    // Check for clash with existing showtimes in the same room and date
    const clash = showtimes.some((s) => {
      if (s.date !== date || s.roomName !== roomName) return false;

      const [sStartHour, sStartMin] = s.startTime.split(":").map(Number);
      const [sEndHour, sEndMin] = s.endTime.split(":").map(Number);
      const sStartMinutes = sStartHour * 60 + sStartMin;
      const sEndMinutes = sEndHour * 60 + sEndMin;

      // Overlap condition: start < existing end && end > existing start
      return startMinutes < sEndMinutes && endMinutes > sStartMinutes;
    });

    if (clash) {
      alert(
        "Showtime clashes with an existing showtime in the same room and date"
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, endTime, movieId, roomName }),
      });

      if (!res.ok) throw new Error("Failed to add showtime");

      const newShowtime = await res.json();
      const movie = movies.find((m) => String(m.id) === String(movieId));

      setShowtimes((prev) => [
        ...prev,
        {
          id: newShowtime._id ?? crypto.randomUUID(),
          startTime: newShowtime.startTime || newShowtime.start_time,
          endTime: newShowtime.endTime || newShowtime.end_time,
          date: newShowtime.date,
          movieId: newShowtime.movieId || newShowtime.movie_id,
          movieName: movie?.title || "Unknown",
          roomName: newShowtime.roomName || newShowtime.room_name,
          seatBinary: newShowtime.seatBinary || newShowtime.seat_binary || "",
        },
      ]);

      // Reset form
      setDate("");
      setStartHour(10);
      setStartMinute(0);
      setEndHour(12);
      setEndMinute(0);
      setMovieId("");
      setRoomName("");

      alert("Showtime added successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Error adding showtime: " + err.message);
    }
  };

  // Delete showtime (only selected one)
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this showtime?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/showtimes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete showtime");
      }

      setShowtimes((prev) => prev.filter((s) => s.id !== id));
      alert("Showtime deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting showtime:", err);
      alert("Error deleting showtime: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-[#75D1A6] mb-6">Manage Showtimes</h1>

      {/* Add Showtime Form */}
      <div className="bg-[#1f1f1f] p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Showtime</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          />

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={23}
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16 text-black"
            />
            :
            <input
              type="number"
              min={0}
              max={59}
              value={startMinute}
              onChange={(e) => setStartMinute(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16 text-black"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={23}
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16 text-black"
            />
            :
            <input
              type="number"
              min={0}
              max={59}
              value={endMinute}
              onChange={(e) => setEndMinute(Number(e.target.value))}
              className="border rounded px-2 py-1 w-16 text-black"
            />
          </div>

          <select
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="border rounded px-3 py-2 bg-[#1f1f1f] text-white focus:outline-none"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <select
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border rounded px-3 py-2 bg-[#1f1f1f] text-white focus:outline-none"
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
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-2"
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
              <th className="p-4 border border-gray-700 text-left">Date</th>
              <th className="p-4 border border-gray-700 text-left">Start Time</th>
              <th className="p-4 border border-gray-700 text-left">End Time</th>
              <th className="p-4 border border-gray-700 text-left">Movie</th>
              <th className="p-4 border border-gray-700 text-left">Room</th>
              <th className="p-4 border border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => (
              <tr key={s.id} className="hover:bg-[#2a2a2a] transition">
                <td className="p-4 border border-gray-700">{s.date}</td>
                <td className="p-4 border border-gray-700">{s.startTime}</td>
                <td className="p-4 border border-gray-700">{s.endTime}</td>
                <td className="p-4 border border-gray-700">{s.movieName}</td>
                <td className="p-4 border border-gray-700">{s.roomName}</td>
                <td className="p-4 border border-gray-700 text-center">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
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
