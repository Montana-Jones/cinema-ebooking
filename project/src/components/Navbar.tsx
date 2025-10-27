"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import search from "@/assets/search.png";
import gear from "@/assets/gear.png";
import styles from "@/components/Card.module.css";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const { user, setUser } = useUser(); // assume setUser can update context
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    // Clear user from context or localStorage
    setUser(null);
    // Redirect to home
    window.location.href = "/";
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

        {/* Admin-only link */}
        {isAdmin && (
          <Link
            href="/manage-movies"
            className="ml-4 text-[#675068] font-bold hover:text-[#75D1A6]"
          >
            <Image
              src={gear}
              alt="manage movies"
              priority
              className="cursor-pointer w-9 h-9"
            />
          </Link>
        )}

        {/* Profile button for non-admin logged-in users */}
        {isLoggedIn && !isAdmin && (
          <Link href={`/edit-profile/${user.email}`} className="ml-4">
            <Image
              src={avatar}
              alt="profile"
              priority
              className="cursor-pointer w-9 h-9"
            />
          </Link>
        )}

        {/* Show login/signup for guests */}
        {!isLoggedIn && (
          <div className="relative ml-4">
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
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50">
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

        {/* Logout button for any logged-in user */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="ml-4 text-[#675068] font-bold hover:text-[#75D1A6]"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
