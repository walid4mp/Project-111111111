'use client';

import { cn } from '@/app/lib/utils';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'vip' | 'gold' | 'emerald' | 'purple' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-700 text-gray-200',
      vip: 'vip-badge text-black font-bold',
      gold: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      emerald: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      purple: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white',
      red: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    };

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
