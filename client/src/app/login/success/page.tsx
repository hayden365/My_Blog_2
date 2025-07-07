"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useCallback } from "react";
import { useAuthStore } from "@/app/lib/store/authStore";

const LoginSuccessPage = () => {
  const { checkAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    try {
      // 서버에서 인증 상태 확인 (httpOnly 쿠키는 자동으로 전송됨)
      await checkAuth();
      router.replace("/");
    } catch (error) {
      console.error("로그인 처리 중 오류 발생:", error);
      router.replace("/");
    }
  }, [router, checkAuth]);

  useEffect(() => {
    handleLogin();
  }, [handleLogin]);

  return <div>로그인 중...</div>;
};

export default LoginSuccessPage;
