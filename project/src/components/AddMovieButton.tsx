import React from "react";
import Image from "next/image";
import Link from "next/link";
import add from "@/assets/add.png";

export default function AddMovieButton() {
  return (
    <div className="fixed right-3 bottom-3">
      <Link href="/add-movie">
        <Image src={add} alt="add movie" width="56" height="56" />
      </Link>
    </div>
  );
}
