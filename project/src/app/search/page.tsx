"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Loading from "@/components/Loading";

const App = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState<string[]>([]); // For dynamic dropdown

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("title");
  const [genre, setGenre] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setAllMovies(data);
        setFilteredMovies(data);
        setLoading(false);

        // Extract unique genres dynamically
        const genreSet = new Set<string>();
        data.forEach((movie: any) => {
          if (movie.genre) {
            movie.genre.split(",").forEach((g: string) => {
              genreSet.add(g.trim());
            });
          }
        });
        setGenres(Array.from(genreSet));
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length === 0) {
      handleSearch("", genre);
    }

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

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSearch = (term, newGenre) => {
    const lowerCaseTerm = (term || "").toLowerCase();
    setSuggestions([]);

    const searchResults = allMovies.filter((movie) => {
      let movieValue;
      if (filterType === "title") {
        movieValue = String(movie.title).toLowerCase();
      } else if (filterType === "genre") {
        movieValue = String(movie.genre).toLowerCase();
      }
      return String(movieValue).includes(lowerCaseTerm);
    });

    const finalFilteredList = searchResults.filter((movie) => {
      const matchesGenre =
        !newGenre ||
        movie.genre
          .toLowerCase()
          .split(",")
          .map((g) => g.trim())
          .includes(newGenre.toLowerCase());
      return matchesGenre;
    });

    setFilteredMovies(finalFilteredList);
  };

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    setSearchTerm("");
    handleSearch("", newGenre);
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setFilterType("title");
    handleSearch(title, genre);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4">
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

            {/* Dynamic Genre Dropdown */}
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
              className="px-8 py-3 text-lg font-semibold text-white bg-[#4c3b4d] rounded-full shadow-md hover:bg-[#675068] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full sm:w-auto mt-4 sm:mt-0"
            >
              Search
            </button>
          </div>
        </div>

        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, index) => (
              <Link
                key={index}
                href={`/movie-details/${movie.id}`}
                className="block bg-[#1f1f1f] rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                  <div className="space-y-1 text-gray-300">
                    <p>
                      <strong>Genre:</strong> {movie.genre}
                    </p>
                    <p className="mt-2 text-[0.9rem] text-[#444]">
                      {movie.synopsis}
                    </p>
                  </div>
                </div>
              </Link>
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
