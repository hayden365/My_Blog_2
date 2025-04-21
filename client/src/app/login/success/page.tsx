"use client";

import { setAccessToken } from "@/app/lib/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const LoginSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        setAccessToken(token);
        router.replace("/");
      } catch (error) {
        console.error("토큰 처리 중 오류 발생:", error);
        router.replace("/");
      }
    }
  }, [searchParams, router]);

  return <div>로그인 중...</div>;
};

export default LoginSuccessPage;
