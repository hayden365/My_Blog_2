import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ className, disabled, children, ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "text-sm rounded-full px-3 py-0.5 cursor-pointer",
        disabled
          ? "bg-green-700/25 text-gray-100 cursor-not-allowed"
          : "bg-green-700 text-white",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
