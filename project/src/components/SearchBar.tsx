"use client";

import React from "react";
import search from "@/assets/search.png";
import Image from "next/image";
import styles from "@/components/Card.module.css";

interface SearchBarProps {
  searched: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export default function SearchBar({ searched, onChange, onSubmit }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search..."
        className={styles.input}
        value={searched}
        onChange={(e) => onChange(e.target.value)} 
      />
      <button type="submit" className={styles.button}>
        <Image src={search} alt="search" width={18} height={18} />
      </button>
    </form>
  );
}
