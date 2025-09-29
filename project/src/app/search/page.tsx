"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// The main App component that contains the search bar.
const App = () => {
  // Mock movie data to simulate a database. In a real-world app, this would come from an API.
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  // State to hold the value of the search input field and the selected filter types.
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("title"); // Default filter to 'title'
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/movies") // adjust if backend runs on a different port
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

    // If the search box is cleared, reset the movie list based on the dropdowns
    if (value.length === 0) {
      handleSearch("", genre, year, rating);
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
  const handleSearch = (term, newGenre, newYear, newRating) => {
    const lowerCaseTerm = (term || "").toLowerCase();
    setSuggestions([]); // Clear suggestions on search

    // Primary filter based on the main search bar and filter dropdown
    const searchResults = allMovies.filter((movie) => {
      let movieValue;
      if (filterType === "title") {
        movieValue = movie.title.toLowerCase();
      } else if (filterType === "genre") {
        movieValue = movie.genre.toLowerCase();
      } else if (filterType === "year") {
        movieValue = movie.year.toLowerCase();
      }
      return movieValue.includes(lowerCaseTerm);
    });

    // Apply additional filters from the other dropdowns
    const finalFilteredList = searchResults.filter((movie) => {
      const matchesGenre =
        !newGenre || movie.genre.toLowerCase() === newGenre.toLowerCase();
      const matchesYear = !newYear || movie.year === newYear;
      const matchesRating = !newRating || movie.rating === newRating;
      return matchesGenre && matchesYear && matchesRating;
    });

    setFilteredMovies(finalFilteredList);
  };

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    setSearchTerm(""); // Clear search term to show all movies for the new genre
    handleSearch("", newGenre, year, rating);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    setSearchTerm("");
    handleSearch("", genre, newYear, rating);
  };

  const handleRatingChange = (event) => {
    const newRating = event.target.value;
    setRating(newRating);
    setSearchTerm("");
    handleSearch("", genre, year, newRating);
  };

  // Function to handle clicking on a suggestion
  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    // Explicitly set the filter type to 'title' when a suggestion is clicked.
    // This ensures the search works correctly, overriding any other filter selected.
    setFilterType("title");
    // Now call handleSearch with the new term. The logic inside handleSearch will correctly use the new filterType.
    handleSearch(title, genre, year, rating);
  };

  return (
    <main>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4">
        <div className="w-full bg-background p-6 rounded-2xl shadow-lg border border-gray-700">
          {/* Main search and title bar */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 w-full mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Movie Search</h1>
            {/* input box */}
            <div className="relative flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder={`Search by ${filterType}...`}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchTerm, genre, year, rating);
                  }
                }}
                className="w-full pl-12 pr-5 py-3 text-lg rounded-full border border-gray-600 bg-[#1f1f1f] text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {/* dropdown */}
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="flex-shrink-0 px-5 py-3 text-lg rounded-full border border-gray-600 bg-[#1f1f1f] text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Title</option>
              <option value="genre">Genre</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        {/* Movie Results Section */}
        <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, index) => (
              <Link
                key={index}
                href={`/movie-details/${movie.id}`} // assuming each movie has a unique 'id'
                className="block bg-[#1f1f1f] rounded-2xl shadow-lg border border-gray-700 hover:scale-105 transition-transform"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                  <div className="space-y-1 text-gray-300">
                    <p>
                      <strong>Genre:</strong> {movie.genre}
                    </p>
                    <p>
                      <strong>Year:</strong> {movie.year}
                    </p>
                    <p>
                      <strong>Rating:</strong> {movie.rating}
                    </p>
                    <p className="mt-2 text-sm italic">{movie.description}</p>
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
