"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const LoginSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        // 토큰에서 사용자 정보 추출
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const userData = JSON.parse(jsonPayload);

        // 토큰과 사용자 정보 저장
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));

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
