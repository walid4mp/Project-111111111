'use client';

import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import ParticleBackground from '@/app/components/ui/ParticleBackground';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass-effect-strong rounded-3xl p-8 shadow-2xl space-y-6">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>

          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
            <p className="text-gray-400">Enter your email and we&apos;ll send a reset link.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              Reset instructions have been sent to <span className="font-semibold">{email}</span>.
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Input type="email" label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-5 h-5" />} fullWidth required />
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
