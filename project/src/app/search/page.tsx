"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const App = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("title"); // Default filter to 'title'
  const [genre, setGenre] = useState("");
  const [mpaaRating, setmpaaRating] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies")
      .then((res) => res.json())
      .then((data) => {
        setAllMovies(data);
        setFilteredMovies(data);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Function to handle changes in the input field.
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length === 0) {
      handleSearch("", genre, mpaaRating);
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

  // Function to handle changes in the filter dropdowns.
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Function to handle the search action.
  const handleSearch = (term, newGenre, newRating) => {
    const lowerCaseTerm = (term || "").toLowerCase();
    setSuggestions([]); // Clear suggestions on search

    const searchResults = allMovies.filter((movie) => {
      let movieValue;
      if (filterType === "title") {
        movieValue = String(movie.title).toLowerCase();
      } else if (filterType === "genre") {
        movieValue = String(movie.genre).toLowerCase();
      }
      return String(movieValue).includes(lowerCaseTerm);
    });

    // Apply additional filters from genre + mpaaRating only
    const finalFilteredList = searchResults.filter((movie) => {
      const matchesGenre =
        !newGenre || movie.genre.toLowerCase().includes(newGenre.toLowerCase());

      const matchesRating =
        !newRating || String(movie.mpaaRating) === String(newRating);

      return matchesGenre && matchesRating;
    });

    setFilteredMovies(finalFilteredList);
  };

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    setSearchTerm("");
    handleSearch("", newGenre, mpaaRating);
  };

  const handleRatingChange = (event) => {
    const newRating = event.target.value;
    setmpaaRating(newRating);
    setSearchTerm("");
    handleSearch("", genre, newRating);
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setFilterType("title");
    handleSearch(title, genre, mpaaRating);
  };

  return (
    <main>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4">
        <div className="w-full bg-background p-6 rounded-2xl shadow-lg border border-gray-700">
          {/* Main search and title bar */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 w-full mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Movie Search
            </h1>

            {/* Search Input */}
            <div className="relative flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder={`Search by ${filterType}...`}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleSearch(searchTerm, genre, mpaaRating);
                }}
                className="w-full pl-12 pr-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter Type Dropdown */}
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Title</option>
              <option value="genre">Genre</option>
            </select>

            {/* Genre Dropdown */}
            <select
              value={genre}
              onChange={handleGenreChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
              <option value="Drama">Drama</option>
              <option value="Romance">Romance</option>
            </select>

            {/* Rating Dropdown */}
            <select
              value={mpaaRating}
              onChange={handleRatingChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
            </select>

            {/* Search button */}
            <button
              onClick={() => handleSearch(searchTerm, genre, mpaaRating)}
              className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out w-full sm:w-auto mt-4 sm:mt-0"
            >
              Search
            </button>
          </div>
        </div>

        {/* Movie Results Section */}
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
                    <p>
                      <strong>Rating:</strong> {movie.mpaaRating}
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
