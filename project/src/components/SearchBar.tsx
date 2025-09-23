"use client";

import React from "react";
import Button from "@/components/Button";
import search from "@/assets/search.png";
import Image from "next/image";
import styles from "@/components/Card.module.css";

export default function SearchBar() {
  return (
    <form className={styles.searchBar}>
      <input type="text" placeholder="Search..." className={styles.input} />
      <button type="submit" className={styles.button}>
        <Image src={search} alt="search" width={18} height={18} />
      </button>
    </form>
  );
}
