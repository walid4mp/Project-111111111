'use client';

import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface CardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  > {
  variant?: 'default' | 'glass' | 'premium' | 'glow';
  hover?: boolean;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      hover = true,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-gray-800/50 backdrop-blur-sm border border-gray-700',
      glass: 'glass-effect',
      premium: 'premium-card',
      glow: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 shadow-lg shadow-blue-500/20',
    };

    const Component = interactive ? motion.div : 'div';

    const motionProps = interactive
      ? {
          whileHover: { scale: 1.02, y: -4 },
          whileTap: { scale: 0.98 },
        }
      : {};

    return (
      <Component
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          variants[variant],
          hover && 'hover:shadow-xl',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;
