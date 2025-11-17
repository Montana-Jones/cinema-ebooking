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
  movieName?: string; // store movie name
  roomName: string;
  seatBinary: string;
}

export default function ManageShowtimes() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(10); // 0-23
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(12); // 0-23
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

  useEffect(() => {
    // Fetch movies
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch(console.error);

    // Fetch rooms
    fetch("http://localhost:8080/api/showrooms")
      .then((res) => res.json())
      .then(setRooms)
      .catch(console.error);
    }, []);

    // Fetch showtimes
    useEffect(() => {
    if (movies.length === 0) return;
    
    fetch("http://localhost:8080/api/showtimes")
      .then((res) => res.json())
      .then((data) => {
        const mappedShowtimes = data.map((s: any) => {
          console.log("SHOWTIME MOVIE ID:", s.movie_id);
  console.log("MOVIE LIST:", movies);

          const movie = movies.find((m) => String(m.id) ===String(s.movie_id));
          return {
            id: s._id,
            startTime: s.start_time,
            endTime: s.end_time,
            date: s.date,
            movieId: s.movie_id,
            movieName: movie?.title || "Unknown", // fallback to ID if name not found
            roomName: s.room_name,
            seatBinary: s.seat_binary ?? "",
          };
        });
        setShowtimes(mappedShowtimes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching showtimes:", err);
        setLoading(false);
      });
  }, [movies]); // dependency on movies ensures mapping works

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

  const handleAddShowtime = async () => {
    if (!movieId || !roomName || !date) {
      alert("Please select movie, room, and date");
      return;
    }

   // 2️⃣ Format start and end time as HH:mm
    const startTime = `${startHour.toString().padStart(2, "0")}:${startMinute
      .toString()
      .padStart(2, "0")}`;
    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    try {
      // 3️⃣ Send POST request to backend
      const res = await fetch("http://localhost:8080/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, endTime, movieId, roomName }),
      });

      if (!res.ok) throw new Error("Failed to add showtime");

      // 4️⃣ Get the new showtime returned by backend
      const newShowtime = await res.json();
      const movie = movies.find((m) => String(m.id) === String(movieId));

      // 6️⃣ Add the new showtime to the state so table updates immediately
      setShowtimes((prev) => [
        ...prev,
        {
        id: newShowtime.id || newShowtime._id,
        startTime: newShowtime.startTime || newShowtime.start_time,
        endTime: newShowtime.endTime || newShowtime.end_time,
        date: newShowtime.date,
        movieId: newShowtime.movieId || newShowtime.movie_id,
        movieName: movie?.title || newShowtime.movieId || newShowtime.movie_id,
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
    } catch (err:any) {
      console.error(err);
      alert("Error adding showtime" + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this showtime?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/showtimes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete showtime");

      setShowtimes((prev) => prev.filter((s) => s.id !== id));

      alert("Showtime deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting showtime.");
    }
  };

  if (loading) return <p>Loading showtimes...</p>;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <Navbar />
      <h1 className="text-3xl font-bold text-[#75D1A6] mb-6">
        Manage Showtimes
      </h1>

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

          {/* Start Time */}
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

          {/* End Time */}
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

          {/* Movie Dropdown */}
          <select
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="border rounded px-3 py-2 bg-[#1f1f1f] text-white focus:outline-none"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          {/* Room Dropdown */}
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
                <td className="p-4 border border-gray-700">
                  {s.movieName || s.movieId}
                </td>
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