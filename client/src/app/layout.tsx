import type { Metadata } from "next";
import { Inter, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Suspense } from "react";
import BlogListSkeleton from "./components/common/blogListSkeleton";

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
        <Header />
        <main className="flex justify-center pt-[50px] w-full">
          <Suspense fallback={<BlogListSkeleton />}>{children}</Suspense>
        </main>
      </body>
    </html>
  );
}
