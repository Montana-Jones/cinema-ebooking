"use client";

import Image from "next/image";
import React from "react";
import styles from "./Card.module.css";

interface Showtime {
  id: number;
  movieId: number;
  theatreNum: number;
  startTime: Date;
}

export interface MovieProps {
  movie: {
    id: string;
    title: string;
    genre: string;
    mpaa_rating: string;
    rating: number; //a star rating between 0 and 5
    director: string; //list all directors in a single string
    producer: string; //list all producers in a single string
    cast: string; //list all major cast members in a single string
    synopsis: string;
    poster_url: string;
    trailer_url: string;
    now_showing: boolean;
    coming_soon: boolean;
    showtimes: Showtime[];
  };
}

const MovieEditor: React.FC<MovieProps> = ({ movie }) => {
  return (
    <div className={styles.movieForm}>
      <form>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={movie.title}
          required
        ></input>
        <label htmlFor="genre">Genre:</label>
        <input
          type="text"
          id="genre"
          name="genre"
          defaultValue={movie.genre}
          required
        ></input>
        <label htmlFor="mpaa_rating">Rating:</label>
        <input
          type="text"
          id="mpaa_rating"
          name="mpaa_rating"
          defaultValue={movie.mpaa_rating}
          required
        ></input>
        <label htmlFor="rating">Star Rating:</label>
        <input
          type="number"
          id="rating"
          name="rating"
          defaultValue={movie.rating}
          required
        ></input>
        <label htmlFor="director">Director:</label>
        <input
          type="text"
          id="director"
          name="director"
          defaultValue={movie.director}
          required
        ></input>
        <label htmlFor="producer">Producer:</label>
        <input
          type="text"
          id="producer"
          name="producer"
          defaultValue={movie.producer}
          required
        ></input>
        <label htmlFor="cast">Cast:</label>
        <input
          type="text"
          id="cast"
          name="cast"
          defaultValue={movie.cast}
          required
        ></input>
        <label htmlFor="synopsis">Synopsis:</label>
        <input
          type="text"
          id="synopsis"
          name="synopsis"
          defaultValue={movie.synopsis}
          required
        ></input>
        <label htmlFor="trailer_url">Trailer URL:</label>
        <input
          type="url"
          id="trailer_url"
          name="trailer_url"
          defaultValue={movie.trailer_url}
          required
        ></input>
        <label htmlFor="poster_url">Poster URL:</label>
        <input
          type="url"
          id="poster_url"
          name="poster_url"
          defaultValue={movie.poster_url}
          required
        ></input>
        <fieldset>
          <legend>Status:</legend>
          <label>
            <input
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
              type="radio"
              name="status"
              value="coming_soon"
              defaultChecked={movie.coming_soon}
              required
            />
            Coming Soon
          </label>
        </fieldset>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default MovieEditor;
