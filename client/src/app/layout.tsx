import type { Metadata } from "next";
import { Inter, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Suspense } from "react";
import BlogListSkeleton from "./components/common/blogListSkeleton";
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
      <body className={`${inter.variable} ${nanum.variable} antialiased`}>
        <Providers>
          <Header />
          <div className="flex flex-col items-center h-[calc(100vh-65px)] max-w-[1034px] mx-auto">
            <Suspense fallback={<BlogListSkeleton />}>{children}</Suspense>
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  );
}
