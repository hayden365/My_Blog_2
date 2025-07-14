// In Next.js, this file would be called: app/providers.tsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./lib/store/authStore";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry: (failureCount) => {
          // 네트워크 에러나 5xx 에러만 재시도
          if (failureCount < 3) {
            return true;
          }
          return false;
        },
      },
      mutations: {
        retry: false, // mutation은 재시도하지 않음
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
  const authInitialized = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (authInitialized.current) return;

      try {
        authInitialized.current = true;
        await checkAuth(); // 최초 로드 시 인증 상태 체크
      } catch (error) {
        console.error("Auth initialization failed:", error);
        authInitialized.current = false; // 실패 시 다시 시도할 수 있도록
      }
    };

    initializeAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
