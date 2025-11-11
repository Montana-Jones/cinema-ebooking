import React, { useEffect, useState, FormEvent } from "react";

// ShowtimesDashboard.tsx
// Tailwind-styled React component for viewing/managing showtimes with TypeScript

interface Movie {
  id?: string;
  _id?: string;
  title: string;
  posterUrl?: string;
}

interface Showroom {
  id?: string;
  _id?: string;
  name: string;
}

interface Showtime {
  id?: string;
  _id?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  duration?: string;
  movieId?: string;
  roomName?: string;
  seatBinary?: string;
  movie?: Movie;
  showroom?: Showroom;
}

export default function ShowtimesDashboard() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Showtime | null>(null);

  const emptyForm: Showtime = {
    movieId: "",
    roomName: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    seatBinary: "",
  };
  const [form, setForm] = useState<Showtime>(emptyForm);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [sRes, mRes, rRes] = await Promise.all([
        fetch("/api/showtimes"),
        fetch("/api/movies"),
        fetch("/api/showrooms"),
      ]);
      if (!sRes.ok || !mRes.ok || !rRes.ok) {
        throw new Error("Failed to fetch one or more resources");
      }
      const [sJson, mJson, rJson] = await Promise.all([
        sRes.json(),
        mRes.json(),
        rRes.json(),
      ]);

      setShowtimes(sJson);
      setMovies(mJson);
      setShowrooms(rJson);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  }

  function openEditModal(showtime: Showtime) {
    setEditing(showtime);
    setForm({
      id: showtime.id || showtime._id,
      movieId:
        showtime.movie?.id || showtime.movie?._id || showtime.movieId || "",
      roomName: showtime.roomName || showtime.showroom?.name || "",
      date: showtime.date || "",
      startTime: showtime.startTime || "",
      endTime: showtime.endTime || "",
      duration: showtime.duration || "",
      seatBinary: showtime.seatBinary || "",
    });
    setIsModalOpen(true);
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm("Delete this showtime?")) return;
    try {
      const res = await fetch(`/api/showtimes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setShowtimes((prev) => prev.filter((s) => (s.id || s._id) !== id));
    } catch (err: any) {
      alert("Could not delete: " + err.message);
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: form.duration,
        roomName: form.roomName,
        seatBinary: form.seatBinary,
        movie: { id: form.movieId },
      };

      let res: Response;
      if (editing && (editing.id || editing._id)) {
        const id = editing.id || editing._id;
        res = await fetch(`/api/showtimes/edit/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/showtimes/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Save failed");
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      alert("Save error: " + err.message);
    }
  }

  async function saveSeats(showtimeId: string, seatBinary: string) {
    try {
      const res = await fetch(`/api/showtimes/saveSeats/${showtimeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seatBinary),
      });
      if (!res.ok) throw new Error("Could not save seats");
      const updated = await res.json();
      setShowtimes((prev) =>
        prev.map((s) =>
          s.id === updated.id || s._id === updated._id ? updated : s
        )
      );
      alert("Seats saved");
    } catch (err: any) {
      alert("Seats save failed: " + err.message);
    }
  }

  function formatMovieTitle(movieRef?: Movie) {
    if (!movieRef) return "(no movie)";
    return movieRef.title || movieRef.id || "(movie)";
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Showtimes</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={openAddModal}
        >
          + Add Showtime
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <div className="space-y-4">
          {showtimes.length === 0 && <div>No showtimes found.</div>}

          {showtimes.map((s) => {
            const id = s.id || s._id || "";
            const movie =
              s.movie ||
              movies.find((m) => m.id === (s.movie?.id || s.movieId));
            const room = s.roomName || s.showroom?.name;

            return (
              <div
                key={id}
                className="border rounded p-4 flex gap-4 items-center"
              >
                <img
                  src={movie?.posterUrl || "/placeholder-poster.png"}
                  alt={movie?.title || formatMovieTitle(s.movie)}
                  className="w-20 h-28 object-cover rounded shadow-sm"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">
                        {movie?.title || formatMovieTitle(s.movie)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Room: {room || "(unknown)"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {s.date} • {s.startTime} — {s.endTime} ({s.duration})
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-3 py-1 border rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
                        className="px-3 py-1 border rounded text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <details>
                      <summary className="cursor-pointer text-sm text-gray-700">
                        Seats & raw data
                      </summary>
                      <div className="mt-2">
                        <textarea
                          rows={4}
                          value={s.seatBinary || ""}
                          onChange={(e) => {
                            const newVal = e.target.value;
                            setShowtimes((prev) =>
                              prev.map((x) =>
                                (x.id || x._id) === id
                                  ? { ...x, seatBinary: newVal }
                                  : x
                              )
                            );
                          }}
                          className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveSeats(id, s.seatBinary || "")}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            Save Seats
                          </button>
                          <button
                            onClick={() =>
                              navigator.clipboard?.writeText(s.seatBinary || "")
                            }
                            className="px-3 py-1 border rounded"
                          >
                            Copy Seats
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editing ? "Edit Showtime" : "Add Showtime"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Movie</label>
                <select
                  required
                  value={form.movieId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, movieId: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                >
                  <option value="">-- choose movie --</option>
                  {movies.map((m) => (
                    <option key={m.id || m._id} value={m.id || m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Room</label>
                <select
                  required
                  value={form.roomName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roomName: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                >
                  <option value="">-- choose room --</option>
                  {showrooms.map((r) => (
                    <option key={r.id || r._id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="YYYY-MM-DD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Duration</label>
                <input
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 120m or 2h"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Start Time</label>
                <input
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startTime: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 14:00 or 2:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">End Time</label>
                <input
                  value={form.endTime}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endTime: e.target.value }))
                  }
                  className="mt-1 block w-full border rounded p-2"
                  placeholder="e.g. 16:00 or 4:00 PM"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium">
                  Seat binary (raw)
                </label>
                <textarea
                  value={form.seatBinary}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, seatBinary: e.target.value }))
                  }
                  rows={4}
                  className="mt-1 block w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
