"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const LoginSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/");
    }
  }, [searchParams, router]);

  return <div>LoginSuccessPage</div>;
};

export default LoginSuccessPage;
