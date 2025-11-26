"use client";

import React from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";


export default function Navbar() {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image src={theatre} alt="logo" priority />
        </Link>
      </div>

      <div>
        <strong style={{ color: "#ffffffff", fontSize: "1.25rem" }}>
          Booking Confirmation
        </strong>
      </div>

      <div className={styles.navbarRight}>
        <Image src={avatar} alt="profile" priority />
      </div>
    </nav>
  );
}
