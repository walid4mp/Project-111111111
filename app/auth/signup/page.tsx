'use client';

import Button from '@/app/components/ui/Button';
import GoogleIcon from '@/app/components/ui/GoogleIcon';
import Input from '@/app/components/ui/Input';
import ParticleBackground from '@/app/components/ui/ParticleBackground';
import { motion } from 'framer-motion';
import { Apple, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/profile');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass-effect-strong rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-4xl font-bold gradient-text mb-2">
              Create Account
            </motion.h1>
            <p className="text-gray-400">Join the WarHex gaming community.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input type="text" label="Username" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} icon={<User className="w-5 h-5" />} fullWidth required />
            <Input type="email" label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-5 h-5" />} fullWidth required />
            <Input type="password" label="Password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-5 h-5" />} fullWidth required />

            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="ghost" icon={<GoogleIcon className="w-5 h-5" />} onClick={() => router.push('/')}>
              Google
            </Button>
            <Button variant="ghost" icon={<Apple className="w-5 h-5" />} onClick={() => router.push('/')}>
              Apple
            </Button>
          </div>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
