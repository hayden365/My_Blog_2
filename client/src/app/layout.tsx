import type { Metadata } from "next";
import { Inter, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Suspense } from "react";
import BlogListSkeleton from "./components/common/blogListSkeleton";
import Providers from "./provider";

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
          <div className="flex justify-center w-full">
            <Suspense fallback={<BlogListSkeleton />}>{children}</Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}
