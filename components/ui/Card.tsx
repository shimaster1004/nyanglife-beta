import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, noPadding = false, children, ...props }) => {
  return (
    <div 
      className={cn("bg-surface rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden", className)} 
      {...props}
    >
      <div className={cn(noPadding ? "" : "p-5")}>
        {children}
      </div>
    </div>
  );
};
