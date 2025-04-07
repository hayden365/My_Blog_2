import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`text-sm bg-green-700 text-white rounded-full px-3 py-0.5 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
