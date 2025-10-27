"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import search from "@/assets/search.png";
import gear from "@/assets/gear.png";
import avatar from "@/assets/avatar.png";
import logout from "@/assets/logout.png";
import theatre from "@/assets/theatre.png";

interface User {
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className={styles.navbarContainer}>
      {/* Left side: logo */}
      <div className={styles.navbarLeft}>
        <Link href="/">
          <Image src={theatre} alt="logo" priority />
        </Link>
      </div>

      {/* Right side: icons */}
      <div className={styles.navbarRight}>
        {/* Search icon */}
        <Link href="/search">
          <Image src={search} alt="search" priority />
        </Link>

        {/* Logged-in user section */}
        {user ? (
          <div className="flex items-center space-x-4 ml-4">
            <span>
              Hello {user.email} {user.role === "ADMIN" ? "(Admin)" : ""}
            </span>

            {/* Admin-only manage movies icon */}
            {user.role === "ADMIN" && (
              <Link href="/manage-movies">
                <Image
                  src={gear}
                  alt="manage movies"
                  className="cursor-pointer w-9 h-9"
                  priority
                />
              </Link>
            )}

            {/* Non-admin users can edit profile */}
            {user.role !== "ADMIN" && (
              <Link href={`/edit-profile/${user.email}`}>
                <Image
                  src={avatar}
                  alt="profile"
                  priority
                  className="cursor-pointer w-9 h-9"
                />
              </Link>
            )}

            {/* Logout icon for all logged-in users */}
            <button onClick={handleLogout} className="focus:outline-none">
              <Image
                src={logout}
                alt="logout"
                priority
                className="cursor-pointer w-9 h-9"
              />
            </button>
          </div>
        ) : (
          // Logged-out users: avatar with dropdown
          <div ref={menuRef} className="relative ml-4 flex items-center">
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
              <div className="absolute top-9 right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-50">
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
          </div>
        )}
      </div>
    </nav>
  );
}
