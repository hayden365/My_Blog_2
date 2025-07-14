"use client";

import { useEffect, useState } from "react";

interface TableOfContentsProps {
  sections: {
    id: string;
    title: string;
  }[];
}

const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-24 w-64 bg-white  rounded-sm p-4 shadow-sm">
      <h4 className="text-lg font-semibold mb-4 text-gray-800">목차</h4>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === section.id
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
