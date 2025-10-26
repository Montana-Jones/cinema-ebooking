"use client";

<<<<<<< Updated upstream
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> Stashed changes
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import theatre from "@/assets/theatre.png";
import Link from "next/link";
import styles from "@/components/Card.module.css";
import search from "@/assets/search.png";
import gear from "@/assets/gear.png";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
<<<<<<< Updated upstream
=======
  const { user } = useUser(); // get user from context
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        <Image src={avatar} alt="profile" priority />
=======

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

        {/* Profile button only for non-admin logged-in users */}
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
>>>>>>> Stashed changes
      </div>
    </nav>
  );
}
