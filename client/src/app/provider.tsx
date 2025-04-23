// In Next.js, this file would be called: app/providers.tsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { initAuth } from "./lib/services/authService";
import { useAuthStore } from "./lib/store/authStore";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
    checkAuth(); // 최초 로드 시 인증 상태 체크

    // 새로고침 시에도 인증 상태 체크하도록 이벤트 리스너 추가
    // const handleFocus = () => {
    //   checkAuth();
    // };

    // window.addEventListener("focus", handleFocus);

    // return () => {
    //   window.removeEventListener("focus", handleFocus);
    // };
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
