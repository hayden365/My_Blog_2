import type { Metadata } from "next";
import { Inter, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Suspense } from "react";
import PostListSkeleton from "./components/common/postListSkeleton";
import Providers from "./provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nanum = Nanum_Gothic({
  weight: ["400", "700"],
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "My blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${inter.variable} ${nanum.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <Header />
          <div className="flex-1 flex flex-col items-center w-full max-w-[1034px] mx-auto">
            <Suspense fallback={<PostListSkeleton />}>{children}</Suspense>
          </div>
          <footer className="h-10" />
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  );
}
