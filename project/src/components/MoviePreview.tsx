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
    <Link
      href={`/movie-details/${movie._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card style={{ cursor: "pointer" }}>
        <div className={styles.moviePreview}>
          <Image
            src={movie.poster_url}
            alt={movie.title}
            width={250}
            height={375}
            className={styles.posterPreview}
          />
        </div>
      </Card>
    </Link>
  );
};

export default MoviePreview;
