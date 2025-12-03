"use client";

import React from "react";
import Link from "next/link";
import Navbar from "./Navbar";


const AccessDenied: React.FC = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <Navbar />
        <p className="text-lg mb-6">Access denied. Please log in.</p>
        <Link
          href="/login"
          className="bg-[#4c3b4d] px-4 py-3 rounded-2xl text-lg font-medium hover:bg-[#5d4561]"
        >
          Go to login page
        </Link>
      </div>
    );
};

export default AccessDenied;
