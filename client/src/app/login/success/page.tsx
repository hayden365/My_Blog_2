"use client";

import { setAccessToken } from "@/app/lib/services/authService";
import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { useAuthStore } from "@/app/lib/store/authStore";

// 쿠키에서 토큰 읽기
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const LoginSuccessPage = () => {
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    const token = getCookie("accessToken");
    if (token) {
      try {
        setAccessToken(token);
        await checkAuth();
        router.replace("/");
      } catch (error) {
        console.error("토큰 처리 중 오류 발생:", error);
        router.replace("/");
      }
    } else {
      // 토큰이 없는 경우도 홈으로 리다이렉트
      router.replace("/");
    }
  }, [router, checkAuth]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return <div>로그인 중...</div>;
};

export default LoginSuccessPage;
