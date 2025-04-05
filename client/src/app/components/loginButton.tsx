"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<{
    profileImage?: string;
  }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAuthStatus = useCallback(() => {
    if (!isClient) return;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split(".")[1];
        if (!base64Url) {
          setIsLoggedIn(false);
          setUserProfile({});
          return;
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const userData = JSON.parse(jsonPayload);
        if (
          isLoggedIn !== true ||
          JSON.stringify(userProfile) !== JSON.stringify(userData)
        ) {
          setIsLoggedIn(true);
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생:", error);
        handleLogout();
      }
    } else if (isLoggedIn !== false) {
      setIsLoggedIn(false);
      setUserProfile({});
    }
  }, [isLoggedIn, userProfile, isClient]);

  useEffect(() => {
    if (!isClient) return;

    checkAuthStatus();

    const handleLocationChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("load", checkAuthStatus);
    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("load", checkAuthStatus);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [checkAuthStatus, isClient]);

  useEffect(() => {
    if (!isClient) return;

    const observer = new MutationObserver(() => {
      checkAuthStatus();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [checkAuthStatus, isClient]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/auth/google`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile({});
  };

  // 서버 사이드에서는 아무것도 렌더링하지 않음
  if (!isClient) {
    return null;
  }

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoggedIn === null) {
    return null;
  }

  if (isLoggedIn && userProfile.profileImage) {
    return (
      <div className="relative profile-dropdown">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
              onClick={handleLogout}
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
      onClick={handleLogin}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
    >
      Google 로그인
    </button>
  );
};

export default LoginButton;
