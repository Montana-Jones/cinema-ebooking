"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import SearchBar from "@/components/SearchBar";
import GenreBar from "@/components/GenreBar";

interface NavbarProps {
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  searched: string;
  setSearched: (searched: string) => void;
}

export default function Navbar({
  selectedGenre,
  setSelectedGenre,
  searched,
  setSearched,
}: NavbarProps) {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image src={theatre} alt="logo" priority />
        </Link>
      </div>
      <div>
        <SearchBar searched={searched} onChange={setSearched} />
      </div>
      <div>
        <GenreBar selected={selectedGenre} onChange={setSelectedGenre} />
      </div>
      <div>
        <Image
          src={avatar}
          alt="profile"
          className={styles.navbarProfile}
          priority
        />
      </div>
    </nav>
  );
}
