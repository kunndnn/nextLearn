import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", maxLength = 50, ...props }, ref) => {
    return (
      <input
        ref={ref}
        maxLength={maxLength}
        className={`border rounded p-1 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
