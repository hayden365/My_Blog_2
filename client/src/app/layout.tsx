import type { Metadata } from "next";
import { Inter, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

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
  description: "This is a blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${nanum.variable} antialiased`}>
        <Header />
        <div className="flex justify-center pt-[50px] w-full">{children}</div>
      </body>
    </html>
  );
}
