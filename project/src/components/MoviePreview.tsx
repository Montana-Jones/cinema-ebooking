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
        <Card style={{ cursor: "pointer", border: "solid white 1px" }}>
          <div className={styles.moviePreview}>
            <div className={styles.imageWrapper}>
              <Image
                src={movie.poster_url}
                alt={movie.title}
                fill
                className={styles.posterPreview}
                sizes="(max-width: 600px) 100vw, 300px"
              />
            </div>

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
