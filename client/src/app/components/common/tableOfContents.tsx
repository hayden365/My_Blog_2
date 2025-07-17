"use client";

import { useEffect, useState, useRef } from "react";

interface TableOfContentsProps {
  sections: {
    id: string;
    level?: 1 | 2;
    text: string;
  }[];
}

const TableOfContents = ({ sections }: TableOfContentsProps) => {
  const [activeSection, setActiveSection] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px",
        threshold: 0,
      }
    );

    // 각 섹션을 관찰
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
            className={`block w-full truncate text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeSection === section.id
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {section.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
