import React from "react";
import Link from "next/link";

export const HomeLogo = () => {
  return (
    <Link
      href="/"
      className="font-inter text-2xl font-semibold hover:text-gray-600 transition-colors"
    >
      Node & Flow
    </Link>
  );
};
