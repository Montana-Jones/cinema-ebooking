"use client";

import React from "react";
import Navbar from "./Navbar";


const Loading: React.FC = () => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <Navbar />
        <p className="text-lg mb-6">Loading...</p>
      </div>
    );
};

export default Loading;
