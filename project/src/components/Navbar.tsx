"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import search from "@/assets/search.png";
import gear from "@/assets/gear.png";
import avatar from "@/assets/avatar.png";
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

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove user from storage
    setUser(null); // reset state
    setMenuOpen(false); // close menu
    window.location.href = "/"; // redirect to home
  };

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
        <div ref={menuRef} className="relative ml-4 flex items-center">
          {user ? (
            <div className="flex items-center space-x-2">
              {user && (
                <span>
                  Hello {user.email} {user.role === "ADMIN" ? "(Admin)" : ""}
                </span>
              )}
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
                    href={`/edit-profile/${user.email}`}
                    className="block px-4 py-2 text-md font-bold text-[#675068] hover:text-[#75D1A6]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-md font-bold text-[#675068] hover:text-[#75D1A6]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
