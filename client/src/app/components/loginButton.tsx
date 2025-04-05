"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "../lib/hooks/useAuth";

const LoginButton = () => {
  const { userProfile, isLoading, isLoggedIn, login, logout } = useAuth();
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
    <button
      onClick={login}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Google 로그인
    </button>
  );
};

export default LoginButton;
