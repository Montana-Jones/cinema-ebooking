"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState(""); // for forgot password feedback
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");

      const loginResponse = await res.json();

      // Fetch full user info
      const userRes = await fetch(
        `http://localhost:8080/api/users/email/${loginResponse.email}`
      );
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const user = await userRes.json();
      console.log("USER OBJECT:", user);

      if (!user.verified) {
        alert("Please verify your account via the link sent to your email.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
setUser(user);

// Redirect based on role
if (user.role === "ADMIN") {
  window.location.href = "/admin-dash";   // your admin dashboard
}else {
  window.location.href = "/";             // normal users
}
    } catch (err) {
      alert("Invalid email or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      setResetMessage("Please enter your email to reset password.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) throw new Error("Failed to send reset email");

      setResetMessage(
        "If your email is registered, a password reset link has been sent."
      );
    } catch (err) {
      console.error(err);
      setResetMessage("Error sending password reset email.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#131313]">
        <div className="w-full max-w-md bg-[#675068] p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-white font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#75D1A6] transition"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#75D1A6] transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#131313] py-2 rounded-lg hover:bg-[#75D1A6] transition font-bold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Forgot Password */}
          <div className="text-center mt-4">
            <button
              onClick={handleForgotPassword}
              className="text-sm text-white font-bold hover:text-[#75D1A6] transition"
            >
              Forgot Password?
            </button>
            {resetMessage && (
              <p className="text-green-400 mt-2 text-sm">{resetMessage}</p>
            )}
          </div>

          <p className="text-center text-sm text-white mt-4">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-white font-bold hover:text-[#75D1A6]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}