"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <Navbar />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-lg">Looks like someone's lost!</p>
      <Link href="/">
        <p className="bg-[#4c3b4d] border-3 border-[#675068] rounded-2xl px-4 py-3 text-lg font-medium">
          Go back home
        </p>
      </Link>
    </div>
  );
}
