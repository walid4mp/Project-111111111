'use client';

import Button from '@/app/components/ui/Button';
import GoogleIcon from '@/app/components/ui/GoogleIcon';
import Input from '@/app/components/ui/Input';
import ParticleBackground from '@/app/components/ui/ParticleBackground';
import { motion } from 'framer-motion';
import { Apple, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      router.push('/');
    }, provider === 'Google' ? 800 : 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-effect-strong rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold gradient-text mb-2"
            >
              WarHex
            </motion.h1>
            <p className="text-gray-400">Welcome back, Warrior!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-5 h-5" />}
              fullWidth
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              fullWidth
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-400">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="ghost"
              onClick={() => handleSocialLogin('Google')}
              icon={<GoogleIcon className="w-5 h-5" />}
            >
              Google
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleSocialLogin('Apple')}
              icon={<Apple className="w-5 h-5" />}
            >
              Apple
            </Button>
          </div>

          <p className="text-center mt-6 text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-blue-400 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
