"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";





export default function topBar() {
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
          <strong style={{ color: "#000000", fontSize: "1.25rem" }}>Select Seats</strong>
      
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
