import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const StyledButton = ({
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "text-sm rounded-full px-4 py-2 cursor-pointer",
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

export default StyledButton;
