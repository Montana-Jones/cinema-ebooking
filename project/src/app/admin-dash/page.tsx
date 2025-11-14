"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface User {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <Navbar />
        <p className="text-lg mb-6">Access denied. Admins only.</p>
        <Link
          href="/"
          className="bg-[#4c3b4d] px-4 py-3 rounded-2xl text-lg font-medium hover:bg-[#5d4561]"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center">
      <Navbar />

      <div className="max-w-md w-full mt-12 p-8 bg-[#1f1f1f] rounded-2xl border border-gray-700 shadow-lg">
        <h1 className="text-3xl font-bold mb-10 text-center text-[#75D1A6]">
          Admin Dashboard
        </h1>

        {/* Vertical Menu */}
        <div className="flex flex-col gap-5">
          <Link
            href="/manage-movies"
            className="bg-[#2b2b2b] p-5 rounded-xl border border-gray-700 hover:border-[#75D1A6] hover:bg-[#252525] transition text-center text-xl font-semibold"
          >
            🎬 Manage Movies
          </Link>

          <Link
            href="/manage-showtimes"
            className="bg-[#2b2b2b] p-5 rounded-xl border border-gray-700 hover:border-[#75D1A6] hover:bg-[#252525] transition text-center text-xl font-semibold"
          >
            🎟 Manage Showtimes
          </Link>

          <Link
            href="/promotions"
            className="bg-[#2b2b2b] p-5 rounded-xl border border-gray-700 hover:border-[#75D1A6] hover:bg-[#252525] transition text-center text-xl font-semibold"
          >
            💰 Promotions
          </Link>

          <Link
            href="/manage-users"
            className="bg-[#2b2b2b] p-5 rounded-xl border border-gray-700 hover:border-[#75D1A6] hover:bg-[#252525] transition text-center text-xl font-semibold"
          >
            👤 Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}