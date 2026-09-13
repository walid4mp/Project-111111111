'use client';

import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Home,
  MessageCircle,
  Radio,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Gamepad2, label: 'Games', href: '/games' },
  { icon: Radio, label: 'Live', href: '/live' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname?.startsWith('/auth')) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe">
      <div className="glass-effect-strong border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center flex-1 h-full group"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        'p-2 rounded-xl transition-all',
                        isActive
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'text-gray-400 group-hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1 font-medium transition-colors',
                        isActive
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-white'
                      )}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
