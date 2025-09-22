"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import styles from "./Card.module.css";
import Link from "next/link";
import Movie from "@/components/Movie";

const MoviePreview: React.FC<Movie.MovieProps> = ({ movie }) => {
  return (
    <Card>
      <div className={styles.moviePreview}>
        {/* Poster */}
        <Image
          src={movie.poster_url}
          alt={movie.title}
          width={250}
          height={375}
          className={styles.posterPreview}
        />
      </div>
    </Card>
  );
};

export default MoviePreview;
