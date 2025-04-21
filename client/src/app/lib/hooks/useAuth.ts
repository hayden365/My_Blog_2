// hooks/useAuth.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  getUserData,
  refreshToken,
  login as serviceLogin,
  logout as serviceLogout,
} from "../services/authService";

export type UserProfile = {
  profileImage?: string;
  name?: string;
  email?: string;
};

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const checkAuthStatus = useCallback(async () => {
    if (typeof window === "undefined") return;

    let currentUserData = getUserData();

    if (!currentUserData) {
      try {
        await refreshToken();
        currentUserData = getUserData();
      } catch (error) {
        console.info("Not logged in yet.", error);
      }
    }

    if (currentUserData) {
      setUserProfile({
        profileImage: currentUserData.profileImage,
        name: currentUserData.name,
        email: currentUserData.email,
      });
    } else {
      setUserProfile({});
    }

    setIsLoading(false);
  }, []);

  const login = () => {
    serviceLogin();
  };

  const logout = async () => {
    await serviceLogout();
    setUserProfile({});
  };

  useEffect(() => {
    checkAuthStatus();
  }, [pathname, checkAuthStatus]);

  return {
    userProfile,
    isLoading,
    isLoggedIn: !!userProfile?.profileImage,
    login,
    logout,
  };
};
