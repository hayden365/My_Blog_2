"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuthStore } from "../lib/store/authStore";
import Link from "next/link";

const ProfileButton = () => {
  const { userProfile, isLoading, isLoggedIn, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (typeof window === "undefined" || isLoading) {
    return null;
  }

  if (isLoggedIn && userProfile?.profileImage) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 focus:outline-none cursor-pointer"
        >
          <Image
            src={userProfile.profileImage}
            alt="Profile"
            width={32}
            height={32}
            className="rounded-full"
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-5 py-2 text-sm font-medium border-black border-1 rounded-sm p-1 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
    >
      Login
    </Link>
  );
};

export default ProfileButton;
