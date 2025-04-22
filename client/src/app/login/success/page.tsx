"use client";

import { setAccessToken } from "@/app/lib/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { useAuthStore } from "@/app/lib/store/authStore";

const LoginSuccessPage = () => {
  const { checkAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = useCallback(async () => {
    const token = searchParams.get("token");
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
  }, [searchParams, router, checkAuth]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return <div>로그인 중...</div>;
};

export default LoginSuccessPage;
