"use client";

import Link from "next/link";
import LoginButton from "./loginButton";
import { useAuth } from "../lib/hooks/useAuth";
import { usePathname } from "next/navigation";
import { HomeLogo } from "./common/homeLogo";

const Header = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  if (pathname === "/edit") {
    return null;
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shadow-xs">
      <HomeLogo />
      <div className="flex items-center gap-10">
        {isLoggedIn && (
          <Link
            href="/edit"
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-end gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="text-sm">Write</span>
          </Link>
        )}
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;
