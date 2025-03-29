import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shadow-xs">
      <Link
        href="/"
        className="font-inter text-2xl font-semibold hover:text-gray-600 transition-colors"
      >
        Blog
      </Link>
    </header>
  );
};

export default Header;
