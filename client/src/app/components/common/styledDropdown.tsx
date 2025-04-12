import React from "react";

interface StyledDropdownProps {
  visible: boolean;
  children: React.ReactNode;
  className?: string;
  arrowLeft?: number;
}

const StyledDropdown = ({
  visible,
  children,
  className = "",
  arrowLeft = 10,
}: StyledDropdownProps) => {
  if (!visible) return null;

  return (
    <div className={`absolute top-full left-0 mt-1 z-30 ${className}`}>
      {/* 화살표 */}
      <svg
        className="absolute"
        style={{ top: -6, left: arrowLeft }}
        width="16"
        height="8"
        viewBox="0 0 16 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 8L8 0L16 8H0Z" fill="white" />
        <path d="M0 8L8 0L16 8" stroke="#E5E7EB" strokeWidth="1" />
      </svg>

      <div className="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default StyledDropdown;
