"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface Showroom {
  id: string;
  name: string;
  capacity: number;
}

export default function ManageShowtimes() {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sendPromotions, setSendPromotions] = useState(false);


  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("AM");

  const [showroom, setShowroom] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(false); // checkbox (future use)

  useEffect(() => {
    fetch("http://localhost:8080/api/showrooms")
      .then((res) => res.json())
      .then(setShowrooms)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStart = `${time} ${startPeriod}`;
    const formattedEnd = `${endTime} ${endPeriod}`;

    const res = await fetch("http://localhost:8080/api/showtimes/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        showroomId: showroom,
        date,
        startTime: formattedStart,
        endTime: formattedEnd,
        notifyUsers,
      }),
    });

    if (res.status === 409) {
      alert("⚠️ Scheduling conflict — this showroom is already booked!");
    } else if (res.ok) {
      alert("✅ Showtime added successfully!");
    } else {
      alert("❌ Failed to add showtime.");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <Navbar />
      <div className="max-w-md mx-auto bg-[#1f1f1f] p-8 rounded-2xl border border-gray-700 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-[#75D1A6]">
          Assign Showtime
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>Date:</label>
          <input
            type="date"
            className="p-2 bg-[#2a2a2a] rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {/* START TIME WITH AM/PM */}
          <label>Start Time:</label>
          <div className="flex gap-3">
            <input
              type="time"
              className="p-2 bg-[#2a2a2a] rounded-md flex-1"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <select
              className="p-2 bg-[#2a2a2a] rounded-md"
              value={startPeriod}
              onChange={(e) => setStartPeriod(e.target.value)}
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          {/* END TIME WITH AM/PM */}
          <label>End Time:</label>
          <div className="flex gap-3">
            <input
              type="time"
              className="p-2 bg-[#2a2a2a] rounded-md flex-1"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
            <select
              className="p-2 bg-[#2a2a2a] rounded-md"
              value={endPeriod}
              onChange={(e) => setEndPeriod(e.target.value)}
            >
              <option>AM</option>
              <option>PM</option>
            </select>
          </div>

          <label>Showroom:</label>
          <select
            className="p-2 bg-[#2a2a2a] rounded-md"
            value={showroom}
            onChange={(e) => setShowroom(e.target.value)}
            required
          >
            <option value="">-- Select Showroom --</option>
            {showrooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} (Capacity: {r.capacity})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-[#675068] hover:bg-[#4c3b4d] py-2 rounded-full text-white font-semibold transition"
          >
            Add Showtime
          </button>

          <div className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={sendPromotions}
    onChange={(e) => setSendPromotions(e.target.checked)}
  />
  <label>Send me promotional emails</label>
</div>

        </form>
      </div>
    </div>
  );
}