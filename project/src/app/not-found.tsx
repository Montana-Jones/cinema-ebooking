"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-lg">Looks like someone's lost!</p>
      <Link href="/">
        <p className="mb-6 text-lg">Go back home</p>
      </Link>
    </div>
  );
}
