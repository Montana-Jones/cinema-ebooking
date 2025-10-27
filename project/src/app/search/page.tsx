"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface User {
  email: string;
  role: string;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allMovies, setAllMovies] = useState<any[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [genre, setGenre] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setAllMovies(data);
        setFilteredMovies(data);

        // Extract unique genres
        const genreSet = new Set<string>();
        data.forEach((movie: any) => {
          if (movie.genre) {
            movie.genre
              .split(",")
              .forEach((g: string) => genreSet.add(g.trim()));
          }
        });
        setGenres(Array.from(genreSet));
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete movie");

      setFilteredMovies((prev) => prev.filter((m) => m.id !== id));
      setAllMovies((prev) => prev.filter((m) => m.id !== id));
      alert("Movie deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting movie!");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length === 0) handleSearch("", genre);

    if (value.length > 0) {
      const filteredSuggestions = allMovies
        .filter((movie) =>
          movie.title.toLowerCase().includes(value.toLowerCase())
        )
        .map((movie) => movie.title);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setFilterType(event.target.value);

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    setSearchTerm("");
    handleSearch("", newGenre);
  };

  const handleSearch = (term: string, newGenre: string) => {
    const lowerCaseTerm = (term || "").toLowerCase();
    setSuggestions([]);

    const searchResults = allMovies.filter((movie) => {
      const value = String(movie[filterType] || "").toLowerCase();
      return value.includes(lowerCaseTerm);
    });

    const finalFilteredList = searchResults.filter((movie) => {
      if (!newGenre) return true;
      return movie.genre
        .toLowerCase()
        .split(",")
        .map((g) => g.trim())
        .includes(newGenre.toLowerCase());
    });

    setFilteredMovies(finalFilteredList);
  };

  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);
    setFilterType("title");
    handleSearch(title, genre);
  };

  return (
    <main>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4">
        {/* Search Section */}
        <div className="w-full bg-background p-6 rounded-2xl shadow-lg border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 w-full mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Movie Search
            </h1>

            <div className="relative flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder={`Search by ${filterType}...`}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(searchTerm, genre);
                }}
                className="w-full pl-12 pr-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={handleFilterChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Title</option>
              <option value="genre">Genre</option>
            </select>

            <select
              value={genre}
              onChange={handleGenreChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleSearch(searchTerm, genre)}
              className="px-8 py-3 text-lg font-semibold text-white bg-[#4c3b4d] rounded-full shadow-md hover:bg-[#675068] transition-all duration-300 ease-in-out"
            >
              Search
            </button>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex flex-col justify-between bg-[#1f1f1f] rounded-2xl shadow-lg border border-gray-700 p-6 h-[250px]"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    <Link
                      href={`/movie-details/${movie.id}`}
                      className="hover:underline text-[#75D1A6]"
                    >
                      {movie.title}
                    </Link>
                  </h2>
                  <div className="space-y-1 text-gray-300">
                    <p>
                      <strong>Genre:</strong> {movie.genre}
                    </p>
                    <p className="mt-2 text-[0.9rem] text-[#777] line-clamp-3">
                      {movie.synopsis}
                    </p>
                  </div>
                </div>

                {/* Admin-only buttons */}
                {user?.role === "ADMIN" && (
                  <div className="flex justify-around mt-1">
                    <Link
                      href={`/movie-editor/${movie.id}`}
                      className="w-fit text-xl bg-[#75D1A6] border-2 border-white-600 rounded-full p-2 px-4 cursor-pointer"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(movie.id, movie.title)}
                      className="w-fit text-xl bg-[#b33a3a] border-2 border-[#801818] rounded-full p-2 px-4 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 text-lg py-12">
              No movies found. Try a different search!
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;
