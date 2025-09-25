"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  return (
    <nav className={styles.navbarContainer}>
      <div>
        <Link href="/">
          <Image
            src={theatre}
            alt="logo"
            className={styles.navbarLogo}
            priority
          />
        </Link>
      </div>
      <div>
        <SearchBar />
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
