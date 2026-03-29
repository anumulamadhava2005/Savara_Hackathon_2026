import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[24px] bg-white text-on-surface shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden",
          glass && "bg-white/80 backdrop-blur-xl",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />
}
