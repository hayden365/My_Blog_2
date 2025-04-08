import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, className, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={`text-sm rounded-full px-3 py-0.5 cursor-pointer ${
        disabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-green-700 text-white"
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
