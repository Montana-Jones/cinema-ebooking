"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribedToPromotions: boolean;
  suspended: boolean;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  const handleSuspend = async (userId: string) => {
    const confirmSuspend = window.confirm(
      "Are you sure you want to suspend this user?"
    );
    if (!confirmSuspend) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${userId}/suspend`,
        { method: "PUT" }
      );

      if (!res.ok) throw new Error("Failed to suspend user");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, suspended: true } : u
        )
      );
      alert("User suspended successfully!");
    } catch (err) {
      console.error(err);
      alert("Error suspending user!");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Navbar />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 bg-[#1f1f1f] p-8 rounded-2xl border border-gray-700 shadow-lg">
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
                <th className="p-4 border border-gray-700 text-left">Subscribed</th>
                <th className="p-4 border border-gray-700 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#2a2a2a] transition"
                >
                  <td className="p-4 border border-gray-700">{user.firstName}</td>
                  <td className="p-4 border border-gray-700">{user.lastName}</td>
                  <td className="p-4 border border-gray-700">{user.email}</td>
                  <td className="p-4 border border-gray-700 text-center">
                    {user.subscribedToPromotions ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="p-4 border border-gray-700 text-center">
                    {user.suspended ? (
                      <span className="text-red-500 font-semibold">Suspended</span>
                    ) : (
                      <button
                        onClick={() => handleSuspend(user.id)}
                        className="bg-[#b33a3a] hover:bg-[#c44] text-white px-4 py-2 rounded-full text-sm transition"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}