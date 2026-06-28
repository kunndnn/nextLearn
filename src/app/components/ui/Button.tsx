import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost";
}

const variants = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent hover:bg-gray-100",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded px-3 py-1 disabled:opacity-50 ${variants[variant]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
