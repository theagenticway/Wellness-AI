import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, type = 'text', ...props }, ref) => {
    const baseStyles = `
      w-full px-3 py-2 
      border rounded-md 
      bg-white text-gray-900
      placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
    `;

    const errorStyles = error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300';

    const combinedClassName = `${baseStyles} ${errorStyles} ${className}`.trim();

    return (
      <input
        ref={ref}
        type={type}
        className={combinedClassName}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';