'use client';

import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  > {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-purple-500',
      secondary:
        'bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-700/30 hover:shadow-gray-700/50 hover:from-gray-600 hover:to-gray-700',
      outline:
        'bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10',
      ghost: 'bg-white/5 text-white hover:bg-white/10',
      gold: 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50',
      emerald:
        'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={cn(
          'font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && icon && <span>{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
