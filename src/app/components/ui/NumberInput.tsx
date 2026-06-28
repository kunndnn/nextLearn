import { InputHTMLAttributes, forwardRef } from "react";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, className = "", ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      onChange(raw);
    }

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        className={`border rounded p-1 ${className}`}
        onKeyDown={(e) => {
          if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-" || e.key === ".") {
            e.preventDefault();
          }
        }}
        {...props}
      />
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
