"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import search from "@/assets/search.png";

export default function Navbar() {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image src={theatre} alt="logo" priority />
        </Link>
      </div>

      <div className={styles.navbarRight}>
        <Link href="/search">
          <Image src={search} alt="logo" priority />
        </Link>
        <Image src={avatar} alt="profile" priority />
      </div>
    </nav>
  );
}
