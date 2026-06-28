import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", maxLength = 50, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        maxLength={maxLength}
        className={`border rounded p-1 resize-y ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
