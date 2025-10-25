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
        
        <div>
          <strong style={{ color: "#000000", fontSize: "1.25rem" }}>Edit Profile</strong>
      
        </div>

        
      
      <div className={styles.navbarRight}>
        <a
          href="/"
          className="text-2xl font-bold text-black-700 hover:text-red-600 transition"
          aria-label="Go back home"
        >
          ✕
        </a>
      </div>
    </nav>
  );
}