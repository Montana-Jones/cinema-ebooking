"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import styles from "@/components/Card.module.css";
import Navbar from "@/components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Showtime {
  id?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  duration?: string;
  roomName?: string;
  seatBinary?: string;
  movieId?: string;
}

interface Movie {
  id: string;
  title: string;
}

const MovieShowtimesManager: React.FC = () => {
  const params = useParams();
  const movieId = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [form, setForm] = useState({
    date: new Date(),
    startTime: "",
    endTime: "",
    roomName: "",
  });

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieRes, showtimeRes] = await Promise.all([
          fetch(`http://localhost:8080/api/movies/${movieId}`),
          fetch(`http://localhost:8080/api/showtimes`),
        ]);

        const movieData: Movie = await movieRes.json();
        setMovie(movieData);

        const showtimeDataRaw = await showtimeRes.json();

        const showtimeData: Showtime[] = showtimeDataRaw.map((s: any) => ({
          id: s.id,
          startTime: s.start_time,
          endTime: s.end_time,
          date: s.date,
          duration: s.duration,
          roomName: s.room_name,
          seatBinary: s.seat_binary,
          movieId: s.movie_id,
        }));

        const filtered = showtimeData.filter((s) => s.movieId === movieId);
        setShowtimes(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!movie) return;

    const payload: any = {
      ...form,
      movie: { id: movie.id },
      roomName: form.roomName,
      date:
        form.date instanceof Date
          ? form.date.toISOString().split("T")[0]
          : form.date,
    };

    try {
      let res;
      if (editingShowtime) {
        res = await fetch(
          `http://localhost:8080/api/showtimes/edit/${editingShowtime.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(`http://localhost:8080/api/showtimes/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const updatedShowtime = await res.json();

      setShowtimes((prev) => {
        if (editingShowtime) {
          return prev.map((s) =>
            s.id === updatedShowtime.id ? updatedShowtime : s
          );
        } else {
          return [...prev, updatedShowtime];
        }
      });

      setModalOpen(false);
      setEditingShowtime(null);
      setForm({ date: new Date(), startTime: "", endTime: "", roomName: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this showtime?")) return;

    try {
      await fetch(`http://localhost:8080/api/showtimes/${id}`, {
        method: "DELETE",
      });
      setShowtimes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setForm({
      date: showtime.date ? new Date(showtime.date) : new Date(),
      startTime: showtime.startTime || "",
      endTime: showtime.endTime || "",
      roomName: showtime.roomName || "",
    });
    setModalOpen(true);
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 mt-18">
        <h1 className="text-2xl font-bold mb-6">
          Manage Showtimes for {movie?.title || "Loading..."}
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : showtimes.length === 0 ? (
          <p>No showtimes for this movie yet.</p>
        ) : (
          <div className="space-y-4">
            {showtimes.map((s) => (
              <div
                key={s.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Date:</strong> {s.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {s.startTime} - {s.endTime}
                  </p>
                  <p>
                    <strong>Room:</strong> {s.roomName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-[#4c3b4d] border-[3px] border-[#675068] rounded-[2rem] h-fit py-2 px-3 text-base font-medium text-white"
                    onClick={() => openEditModal(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-[#b33a3a] border-[3px] border-[#801818] rounded-[2rem] h-fit py-2 px-3 text-base font-medium text-white"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="bg-[#4c3b4d] border-[3px] border-[#675068] mt-4 rounded-[2rem] h-fit py-2 px-3 text-base font-medium text-white"
          onClick={() => setModalOpen(true)}
        >
          Add Showtime
        </button>

        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="p-6 rounded-lg w-96 bg-gray-900">
              <h2 className="text-xl font-bold mb-4">
                {editingShowtime ? "Edit Showtime" : "Add Showtime"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <DatePicker
                  selected={form.date}
                  onChange={(date: Date) => setForm({ ...form, date })}
                  className="border border-white-600 p-2 w-full bg-black text-white rounded-lg"
                  dateFormat="yyyy-MM-dd"
                  required
                />
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="border border-white-600 p-2 w-full bg-black text-white rounded-lg"
                  required
                />
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="border border-white-600 p-2 w-full bg-black text-white rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="roomName"
                  placeholder="Room Name"
                  value={form.roomName}
                  onChange={handleChange}
                  className="border border-white-600 p-2 w-full bg-black text-white rounded-lg"
                  required
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="flex mt-3 m-auto text-2xl bg-[#b33a3a] border-2 border-[#801818] rounded-full p-3 pr-5 pl-5 cursor-pointer"
                    onClick={() => {
                      setModalOpen(false);
                      setEditingShowtime(null);
                      setForm({
                        date: new Date(),
                        startTime: "",
                        endTime: "",
                        roomName: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex mt-3 m-auto text-2xl bg-[#4c3b4d] border-2 border-[#675068] rounded-full p-3 pr-5 pl-5 cursor-pointer"
                  >
                    {editingShowtime ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieShowtimesManager;
