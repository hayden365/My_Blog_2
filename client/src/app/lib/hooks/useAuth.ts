// hooks/useAuth.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export type UserProfile = {
  profileImage?: string;
};

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const pathname = usePathname();

  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("userData");

    if (token && storedUserData) {
      try {
        const userData: UserProfile = JSON.parse(storedUserData);
        setUserProfile(userData);
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        logout(); // 실패 시 로그아웃
      }
    } else {
      setUserProfile({});
    }
  }, []);

  const login = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserProfile({});
  };

  useEffect(() => {
    checkAuthStatus();
  }, [pathname, checkAuthStatus]);

  return {
    userProfile,
    isLoading: userProfile === null,
    isLoggedIn: !!userProfile?.profileImage,
    login,
    logout,
  };
};
