import React, { useState } from 'react';

// The main App component that contains the search bar.
const App = () => {
  // Mock movie data to simulate a database. In a real-world app, this would come from an API.
  const allMovies = [
    { title: "The Martian", genre: "Sci-Fi", year: "2015", rating: "PG-13", description: "An astronaut is presumed dead after a fierce storm and left behind by his crew on Mars." },
    { title: "Interstellar", genre: "Sci-Fi", year: "2014", rating: "PG-13", description: "A team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival." },
    { title: "Inception", genre: "Sci-Fi", year: "2010", rating: "PG-13", description: "A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
    { title: "Dune", genre: "Sci-Fi", year: "2021", rating: "PG-13", description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes a messianic figure." },
    { title: "The Shawshank Redemption", genre: "Drama", year: "1994", rating: "R", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
    { title: "The Godfather", genre: "Crime", year: "1972", rating: "R", description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
    { title: "Forrest Gump", genre: "Drama", year: "1994", rating: "PG-13", description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal, and other historical events unfold from the perspective of an Alabama man with an IQ of 75." },
    { title: "Pulp Fiction", genre: "Crime", year: "1994", rating: "R", description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
    { title: "The Dark Knight", genre: "Action", year: "2008", rating: "PG-13", description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
    { title: "Gladiator", genre: "Action", year: "2000", rating: "R", description: "A former Roman General sets out to exact vengeance upon the corrupt emperor who murdered his family and sent him into slavery." },
    { title: "Toy Story", genre: "Comedy", year: "1995", rating: "G", description: "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy's room." },
    { title: "Deadpool", genre: "Comedy", year: "2016", rating: "R", description: "A wisecracking mercenary gets a new lease on life when he undergoes a rogue experiment that leaves him with accelerated healing powers." },
    { title: "The Exorcist", genre: "Horror", year: "1973", rating: "R", description: "When a young girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her." },
    { title: "Hereditary", genre: "Horror", year: "2018", rating: "R", description: "A grieving family is haunted by a malevolent presence after the death of their secretive grandmother." },
  ];

  // State to hold the value of the search input field and the selected filter types.
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('title'); // Default filter to 'title'
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [suggestions, setSuggestions] = useState([]);

  // Function to handle changes in the input field.
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // If the search box is cleared, reset the movie list based on the dropdowns
    if (value.length === 0) {
      handleSearch('', genre, year, rating);
    }

    if (value.length > 0) {
      const filteredSuggestions = allMovies
        .filter(movie =>
          movie.title.toLowerCase().includes(value.toLowerCase())
        )
        .map(movie => movie.title);
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
    const lowerCaseTerm = (term || '').toLowerCase();
    setSuggestions([]); // Clear suggestions on search

    // Primary filter based on the main search bar and filter dropdown
    const searchResults = allMovies.filter(movie => {
      let movieValue;
      if (filterType === 'title') {
        movieValue = movie.title.toLowerCase();
      } else if (filterType === 'genre') {
        movieValue = movie.genre.toLowerCase();
      } else if (filterType === 'year') {
        movieValue = movie.year.toLowerCase();
      }
      return movieValue.includes(lowerCaseTerm);
    });

    // Apply additional filters from the other dropdowns
    const finalFilteredList = searchResults.filter(movie => {
      const matchesGenre = !newGenre || movie.genre.toLowerCase() === newGenre.toLowerCase();
      const matchesYear = !newYear || movie.year === newYear;
      const matchesRating = !newRating || movie.rating === newRating;
      return matchesGenre && matchesYear && matchesRating;
    });

    setFilteredMovies(finalFilteredList);
  };

  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    setGenre(newGenre);
    setSearchTerm(''); // Clear search term to show all movies for the new genre
    handleSearch('', newGenre, year, rating);
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setYear(newYear);
    setSearchTerm('');
    handleSearch('', genre, newYear, rating);
  };

  const handleRatingChange = (event) => {
    const newRating = event.target.value;
    setRating(newRating);
    setSearchTerm('');
    handleSearch('', genre, year, newRating);
  };

  // Function to handle clicking on a suggestion
  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    // Explicitly set the filter type to 'title' when a suggestion is clicked.
    // This ensures the search works correctly, overriding any other filter selected.
    setFilterType('title'); 
    // Now call handleSearch with the new term. The logic inside handleSearch will correctly use the new filterType.
    handleSearch(title, genre, year, rating);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        {/* Main search and title bar */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 w-full mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-shrink-0">Movie Search</h1>
          <div className="relative flex-grow w-full md:w-auto">
            <input
              type="text"
              placeholder={`Search by ${filterType}...`}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchTerm, genre, year, rating);
                }
              }}
              className="w-full pl-12 pr-5 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
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
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b-lg shadow-lg max-h-60 overflow-y-auto mt-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Main filter dropdown */}
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="flex-shrink-0 px-5 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
          >
            <option value="title">Title</option>
            <option value="genre">Genre</option>
            <option value="year">Year</option>
          </select>
        </div>

        {/* Additional Filter Dropdowns and Search Button */}
        <div className="flex flex-wrap items-center justify-end space-y-4 sm:space-y-0 sm:space-x-8 w-full">
          <select
            value={genre}
            onChange={handleGenreChange}
            className="flex-shrink-0 px-5 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Horror">Horror</option>
          </select>

          <select
            value={year}
            onChange={handleYearChange}
            className="flex-shrink-0 px-5 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
          >
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>

          <select
            value={rating}
            onChange={handleRatingChange}
            className="flex-shrink-0 px-5 py-3 text-lg rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
          >
            <option value="">All Ratings</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>

          {/* Search button */}
          <button
            onClick={() => handleSearch(searchTerm, genre, year, rating)}
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
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
              <div className="text-gray-600 space-y-1">
                <p><strong>Genre:</strong> {movie.genre}</p>
                <p><strong>Year:</strong> {movie.year}</p>
                <p><strong>Rating:</strong> {movie.rating}</p>
                <p className="mt-2 text-sm italic">{movie.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-500 text-lg py-12">
            No movies found. Try a different search!
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

