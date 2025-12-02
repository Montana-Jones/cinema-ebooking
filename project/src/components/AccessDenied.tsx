"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./Navbar";


const AccessDenied: React.FC = () => {
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
};

export default AccessDenied;
