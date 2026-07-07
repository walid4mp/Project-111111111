'use client';

import { cn } from '@/app/lib/utils';
import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  vipLevel?: number;
  online?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = 'Avatar',
      size = 'md',
      vipLevel,
      online,
      ...props
    },
    ref
  ) => {
    const sizes = {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20',
      '2xl': 'w-24 h-24',
    };

    const getVIPFrame = (level?: number) => {
      if (!level || level === 0) return '';
      if (level >= 15)
        return 'ring-4 ring-offset-2 ring-offset-gray-900 ring-gradient-to-r from-yellow-400 via-pink-500 to-purple-600';
      if (level >= 10)
        return 'ring-4 ring-offset-2 ring-offset-gray-900 ring-yellow-400';
      if (level >= 5)
        return 'ring-4 ring-offset-2 ring-offset-gray-900 ring-purple-500';
      return 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500';
    };

    return (
      <div ref={ref} className={cn('relative inline-block', className)} {...props}>
        <div
          className={cn(
            'rounded-full overflow-hidden bg-gray-700',
            sizes[size],
            vipLevel && getVIPFrame(vipLevel)
          )}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
        {online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-gray-900 rounded-full" />
        )}
        {vipLevel && vipLevel > 0 && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 vip-badge text-black text-xs font-bold px-2 py-0.5 rounded-full">
            VIP {vipLevel}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
