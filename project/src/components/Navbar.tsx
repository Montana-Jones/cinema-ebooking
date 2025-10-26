"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import search from "@/assets/search.png";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Example: retrieve the user's email from localStorage after login
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image src={theatre} alt="logo" priority />
        </Link>
      </div>

      <div className={styles.navbarRight}>
        <Link href="/search">
          <Image src={search} alt="search" priority />
        </Link>

        {/* Profile section */}
        <div ref={menuRef} className="relative">
          {email ? (
            // Logged-in user → clicking profile takes to edit-profile/[email]
            <Link href={`/edit-profile/${email}`}>
              <Image
                src={avatar}
                alt="profile"
                priority
                className="cursor-pointer w-9 h-9"
              />
            </Link>
          ) : (
            <>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="focus:outline-none"
              >
                <Image
                  src={avatar}
                  alt="profile"
                  priority
                  className="cursor-pointer w-9 h-9"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-50">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-md font-bold text-[#675068] hover:text-[#75D1A6]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 text-md font-bold text-[#675068] hover:text-[#75D1A6]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
