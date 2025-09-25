"use client";

import React from "react";
import styles from "@/components/Card.module.css";

interface GenreBarProps {
  selected: string;
  onChange: (value: string) => void;
}

export default function GenreBar({ selected, onChange }: GenreBarProps) {
  return (
    <div className={styles.genreContainer}>
      <span className={styles.genreLabel}>Genre:</span>
      <select
        className={styles.genreBar}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option>All</option>
        <option>Action</option>
        <option>Comedy</option>
        <option>Drama</option>
      </select>
    </div>
  );
}
