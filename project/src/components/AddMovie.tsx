"use client";

import React, { useRef } from "react";
import styles from "./Card.module.css";

const AddMovie: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return; // safety check

    const formData = new FormData(form);
    const movieData = Object.fromEntries(formData.entries()) as Record<
      string,
      any
    >;

    // Convert status string to booleans
    movieData.now_showing = movieData.status === "now_showing";
    movieData.coming_soon = movieData.status === "coming_soon";

    // Remove status key before sending
    delete movieData.status;

    // Convert rating to number
    movieData.rating = parseFloat(movieData.rating);

    try {
      const res = await fetch("http://localhost:8080/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (!res.ok) throw new Error("Failed to add movie");

      alert("Movie added successfully!");
      form.reset(); // safely reset the form
    } catch (error) {
      console.error(error);
      alert("Error adding movie!");
    }
  };

  return (
    <div className={styles.movieForm}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-80 m-2 mr-8 border border-white-600 rounded-lg p-1"
          />
          <label htmlFor="genre">Genre: </label>
          <input
            type="text"
            id="genre"
            name="genre"
            required
            className="w-60 m-2 mr-8 border border-white-600 rounded-lg p-1"
          />
          <label htmlFor="mpaa_rating">MPAA Rating: </label>
          <input
            type="text"
            id="mpaa_rating"
            name="mpaa_rating"
            required
            className="w-20 m-2 mr-8 border border-white-600 rounded-lg p-1"
          />
          <label htmlFor="rating">Star Rating: </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            id="rating"
            name="rating"
            required
            className="w-15 m-2 border border-white-600 rounded-lg p-1"
          />
        </div>
        <div>
          <label htmlFor="director">Director: </label>
          <input
            type="text"
            id="director"
            name="director"
            required
            className="w-100 m-2 mr-8 border border-white-600 rounded-lg p-1"
          />
          <label htmlFor="producer">Producer: </label>
          <input
            type="text"
            id="producer"
            name="producer"
            required
            className="w-120 m-2 border border-white-600 rounded-lg p-1"
          />
        </div>
        <label htmlFor="cast">Cast: </label>
        <input
          type="text"
          id="cast"
          name="cast"
          required
          className="w-250 m-2 border border-white-600 rounded-lg p-1"
        />
        <div className="flex items-center">
          <label htmlFor="synopsis">Synopsis: </label>
          <textarea
            id="synopsis"
            name="synopsis"
            required
            className="w-250 m-2 border border-white-600 rounded-lg p-1"
          />
        </div>
        <div>
          <label htmlFor="trailer_url">Trailer URL: </label>
          <input
            type="url"
            id="trailer_url"
            name="trailer_url"
            required
            className="w-200 m-2 border border-white-600 rounded-lg p-1"
          />
        </div>
        <div>
          <label htmlFor="poster_url">Poster URL: </label>
          <input
            type="url"
            id="poster_url"
            name="poster_url"
            required
            className="w-250 m-2 border border-white-600 rounded-lg p-1"
          />
        </div>
        <div className="flex">
          <p className="mr-3">Status: </p>
          <label className="mr-10">
            <input
              type="radio"
              name="status"
              value="now_showing"
              className="m-1"
              required
            />
            Now Showing
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="coming_soon"
              className="m-1"
              required
            />
            Coming Soon
          </label>
        </div>
        <button
          type="submit"
          className="flex mt-3 m-auto text-2xl bg-[#4c3b4d] border-2 border-[#675068] rounded-full p-3 pr-5 pl-5 cursor-pointer"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
