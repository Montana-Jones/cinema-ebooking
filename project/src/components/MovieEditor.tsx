"use client";

import React, {useEffect, useState} from "react";
import styles from "./Card.module.css";
import Link from "next/link";

interface User {
  role: string;
}

const MovieEditor: React.FC<MovieProps> = ({ movie }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-lg mb-6">Access denied. Admins only.</p>
        <Link
          href="/"
          className="bg-[#4c3b4d] px-4 py-3 rounded-2xl text-lg font-medium hover:bg-[#5d4561]"
        >
          Go back home
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const movieData = Object.fromEntries(formData.entries());

    movieData.now_showing = movieData.status === "now_showing";
    movieData.coming_soon = movieData.status === "coming_soon";
    delete movieData.status;

    try {
      const res = await fetch(`http://localhost:8080/api/movies/${movie.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieData),
      });

      if (!res.ok) throw new Error("Failed to save movie");
      alert("Movie saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving movie!");
    }
  };

  return (
    <div className={styles.movieForm}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title: </label>
          <input
            className="w-80 m-2 mr-8 border border-white-600 rounded-lg p-1"
            type="text"
            id="title"
            name="title"
            defaultValue={movie.title}
            required
          ></input>
          <label htmlFor="genre">Genre: </label>
          <input
            className="w-60 m-2 mr-8 border border-white-600 rounded-lg p-1"
            type="text"
            id="genre"
            name="genre"
            defaultValue={movie.genre}
            required
          ></input>
          <label htmlFor="mpaa_rating">Rating: </label>
          <input
            className="w-20 m-2 mr-8 border border-white-600 rounded-lg p-1"
            type="text"
            id="mpaa_rating"
            name="mpaa_rating"
            defaultValue={movie.mpaa_rating}
            required
          ></input>
          <label htmlFor="rating">Star Rating: </label>
          <input
            className="w-15 m-2 border border-white-600 rounded-lg p-1"
            type="number"
            min="0"
            max="5"
            step="0.1"
            id="rating"
            name="rating"
            defaultValue={movie.rating}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="director">Director: </label>
          <input
            className="w-100 m-2 mr-8 border border-white-600 rounded-lg p-1"
            type="text"
            id="director"
            name="director"
            defaultValue={movie.director}
            required
          ></input>
          <label htmlFor="producer">Producer: </label>
          <input
            className="w-120 m-2 border border-white-600 rounded-lg p-1"
            type="text"
            id="producer"
            name="producer"
            defaultValue={movie.producer}
            required
          ></input>
        </div>
        <label htmlFor="cast">Cast: </label>
        <input
          className="w-250 m-2 border border-white-600 rounded-lg p-1"
          type="text"
          id="cast"
          name="cast"
          defaultValue={movie.cast}
          required
        ></input>
        <div className="flex items-center">
          <label htmlFor="synopsis">Synopsis: </label>
          <textarea
            className="w-250 m-2 border border-white-600 rounded-lg p-1"
            type="text"
            id="synopsis"
            name="synopsis"
            defaultValue={movie.synopsis}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="trailer_url">Trailer URL: </label>
          <input
            className="w-200 m-2 border border-white-600 rounded-lg p-1"
            type="url"
            id="trailer_url"
            name="trailer_url"
            defaultValue={movie.trailer_url}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="poster_url">Poster URL: </label>
          <input
            className="w-250 m-2 border border-white-600 rounded-lg p-1"
            type="url"
            id="poster_url"
            name="poster_url"
            defaultValue={movie.poster_url}
            required
          ></input>
        </div>
        <div className="flex">
          <p className="mr-3">Status: </p>
          <label className="mr-10">
            <input
              className="m-1"
              type="radio"
              name="status"
              value="now_showing"
              defaultChecked={movie.now_showing}
              required
            />
            Now Showing
          </label>
          <label>
            <input
              className="m-1"
              type="radio"
              name="status"
              value="coming_soon"
              defaultChecked={movie.coming_soon}
              required
            />
            Coming Soon
          </label>
        </div>
        <button
          className="flex mt-3 m-auto text-2xl bg-[#4c3b4d] border-2 border-[#675068] rounded-full p-3 pr-5 pl-5 cursor-pointer"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default MovieEditor;
