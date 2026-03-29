import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-300";
    
    const variants = {
      default: "Pulse-gradient text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 btn-gradient",
      outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    
    const sizes = {
      default: "h-14 px-8 py-3", // Bigger, more mobile-app-like heights
      sm: "h-10 rounded-full px-4 text-sm",
      lg: "h-16 rounded-full px-10 text-lg",
      icon: "h-12 w-12",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
