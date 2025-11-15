"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  movieId: string;
  roomName: string;
  seatBinary: string;
}

export default function ManageShowtimes() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(10);
  const [startMinute, setStartMinute] = useState(0);
  const [startAmPm, setStartAmPm] = useState("AM");
  const [endHour, setEndHour] = useState(12);
  const [endMinute, setEndMinute] = useState(0);
  const [endAmPm, setEndAmPm] = useState("PM");
  const [movieId, setMovieId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/showtimes")
      .then((res) => res.json())
      .then((data) => {
        const mappedShowtimes = data.map((s: any) => ({
          id: s._id,
          startTime: s.startTime,
          endTime: s.endTime,
          date: s.date,
          movieId: s.movieId,
          roomName: s.roomName,
          seatBinary: s.seatBinary,
        }));
        setShowtimes(mappedShowtimes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching showtimes:", err);
        setLoading(false);
      });
  }, []);

  const convertTo24Hour = (hour: number, minute: number, ampm: string) => {
    let hour24 = hour;
    if (ampm === "PM" && hour < 12) hour24 += 12;
    if (ampm === "AM" && hour === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAddShowtime = async () => {
    const startTime = convertTo24Hour(startHour, startMinute, startAmPm);
    const endTime = convertTo24Hour(endHour, endMinute, endAmPm);

    try {
      const res = await fetch("http://localhost:8080/api/showtimes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, endTime, movieId, roomName }),
      });

      if (!res.ok) throw new Error("Failed to add showtime");

      const newShowtime = await res.json();
      setShowtimes((prev) => [
        ...prev,
        {
          id: newShowtime._id,
          startTime: newShowtime.startTime,
          endTime: newShowtime.endTime,
          date: newShowtime.date,
          movieId: newShowtime.movieId,
          roomName: newShowtime.roomName,
          seatBinary: newShowtime.seatBinary,
        },
      ]);

      // Reset form
      setDate("");
      setStartHour(10);
      setStartMinute(0);
      setStartAmPm("AM");
      setEndHour(12);
      setEndMinute(0);
      setEndAmPm("PM");
      setMovieId("");
      setRoomName("");
    } catch (err) {
      console.error(err);
      alert("Error adding showtime");
    }
  };

  if (loading) return <p>Loading showtimes...</p>;

  const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this showtime?");
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

          {/* Start Time */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={12}
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
            <select
              value={startAmPm}
              onChange={(e) => setStartAmPm(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          {/* End Time */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={12}
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
            <select
              value={endAmPm}
              onChange={(e) => setEndAmPm(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Movie ID"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          />
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          />

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
              <th className="p-4 border border-gray-700 text-left">Movie ID</th>
              <th className="p-4 border border-gray-700 text-left">Room</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => (
              <tr key={s.id} className="hover:bg-[#2a2a2a] transition">

                <td className="p-4 border border-gray-700">{s.date}</td>
                <td className="p-4 border border-gray-700">{s.startTime}</td>
                <td className="p-4 border border-gray-700">{s.endTime}</td>
                <td className="p-4 border border-gray-700">{s.movieId}</td>
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
