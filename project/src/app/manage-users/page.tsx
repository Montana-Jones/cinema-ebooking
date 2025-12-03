"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AccessDenied from "@/components/AccessDenied";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedToPromotions: boolean;
  suspended: boolean;
  role: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load logged-in user
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user");
      }
    }

    // Fetch users
    fetch("http://localhost:8080/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        const mappedUsers = data.map((u: any) => ({
          id: u.id || u._id,
          firstName: u.firstName || u.firstname || u.first_name || "",
          lastName: u.lastName || u.lastname || u.last_name || "",
          email: u.email || "",
          subscribedToPromotions: u.promotion === "REGISTERED",
          suspended: u.status === "SUSPENDED" || false,
          role: u.role || "USER",
        }));

        setUsers(mappedUsers);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const handleSuspend = async (userId: string) => {
    const confirmSuspend = window.confirm(
      "Are you sure you want to suspend this user? This will delete their account."
    );
    if (!confirmSuspend) return;

    try {
      const url = `http://localhost:8080/api/users/${userId}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) throw new Error(`Failed to suspend user: ${res.status}`);

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert("User suspended successfully!");
    } catch (err) {
      console.error(err);
      alert("Error suspending user!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
        <Navbar />
        <p className="mt-6">Loading users...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main content with margin from navbar */}
      <div className="mt-30 px-6">
        <div className="max-w-6xl mx-auto bg-[#1f1f1f] p-8 rounded-2xl border border-gray-700 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center text-[#75D1A6]">
            Manage Users
          </h1>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-700">
              <thead>
                <tr className="bg-[#2a2a2a] text-[#75D1A6]">
                  <th className="p-4 border border-gray-700 text-left">First Name</th>
                  <th className="p-4 border border-gray-700 text-left">Last Name</th>
                  <th className="p-4 border border-gray-700 text-left">Email</th>
                  <th className="p-4 border border-gray-700 text-center">Subscribed</th>
                  <th className="p-4 border border-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-[#2a2a2a] transition">
                    <td className="p-4 border border-gray-700">{usr.firstName}</td>
                    <td className="p-4 border border-gray-700">{usr.lastName}</td>
                    <td className="p-4 border border-gray-700">{usr.email}</td>
                    <td className="p-4 border border-gray-700 text-center">
                      {usr.subscribedToPromotions ? "✅ Yes" : "❌ No"}
                    </td>
                    <td className="p-4 border border-gray-700 text-center">
                      <button
                        onClick={() => handleSuspend(usr.id)}
                        className="bg-[#b33a3a] hover:bg-[#c44] text-white px-4 py-2 rounded-full text-sm transition"
                      >
                        Suspend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
