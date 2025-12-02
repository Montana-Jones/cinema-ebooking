"use client";

import AccessDenied from "@/components/AccessDenied";
import AddMovie from "@/components/AddMovie";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

interface User {
  role: string;
  status: string;
}

export default function AddMoviePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: Fetch user info from localStorage or an API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <AccessDenied />
    );
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <AddMovie />
    </main>
  );
}
