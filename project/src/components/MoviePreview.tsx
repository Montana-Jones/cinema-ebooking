"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import { MovieProps } from "./Movie";

interface MoviePreviewProps {
  movie: MovieProps["movie"];
}

const MoviePreview: React.FC<MoviePreviewProps> = ({ movie }) => {
  return (
    <div className={styles.previewContainer}>
      <Link
        href={`/movie-details/${movie.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Card style={{ cursor: "pointer" }}>
          
          <div className={styles.moviePreview}>
            <Image
              src={movie.poster_url}
              alt={movie.title}
              width={233}
              height={350}
              className={styles.posterPreview}
            />
            <h2 className={styles.previewTitle}>{movie.title}</h2>
            <div className={styles.previewDetails}>
              <p>{movie.mpaa_rating}</p>
              <p>{movie.genre}</p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default MoviePreview;
