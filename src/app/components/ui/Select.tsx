import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`border rounded p-1 bg-white ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;
