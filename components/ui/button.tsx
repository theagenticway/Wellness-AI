import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center 
      font-medium transition-colors 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 disabled:pointer-events-none
      cursor-pointer
    `;

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent'
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm rounded-md',
      sm: 'h-8 px-3 py-1 text-xs rounded',
      lg: 'h-12 px-6 py-3 text-base rounded-lg'
    };

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';