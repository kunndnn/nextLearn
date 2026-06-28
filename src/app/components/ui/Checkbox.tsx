import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
        <input ref={ref} type="checkbox" id={id} className={`accent-blue-500 ${className}`} {...props} />
        {label && <span className="text-sm">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
