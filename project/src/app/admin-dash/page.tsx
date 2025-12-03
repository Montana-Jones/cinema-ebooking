"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AccessDenied from "@/components/AccessDenied";
import Loading from "@/components/Loading";

interface User {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  if (loading) return <Loading />;


  if (!user || user.role !== "ADMIN") {
    return (
      <AccessDenied />
    );
  }

  

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center">
      <Navbar />

      <div className="max-w-md w-full mt-24 p-8 bg-[#1f1f1f] rounded-2xl border border-gray-700 shadow-lg">
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
            href="/manage-promotions"
            className="bg-[#2b2b2b] p-5 rounded-xl border border-gray-700 hover:border-[#75D1A6] hover:bg-[#252525] transition text-center text-xl font-semibold"
          >
            💰 Manage Promotions
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