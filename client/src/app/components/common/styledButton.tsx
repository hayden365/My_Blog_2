import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const StyledButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "border-black border-1 rounded-sm p-1 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default StyledButton;
