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
import { api } from '@/app/lib/client/api';
import { useLanguage } from '@/app/components/i18n/LanguageProvider';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export default function LoginPage(){
  const {language,t}=useLanguage(); const ar=language==='ar'; const router=useRouter(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');setLoading(true);try{await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});router.push('/')}catch(err){setError(err instanceof Error?err.message:(ar?'تعذر تسجيل الدخول.':'Unable to sign in.'));setLoading(false)}};
  const social=(provider:'google'|'apple')=>{setError('');window.location.href=`/api/auth/oauth?provider=${provider}`};
  return <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir={ar?'rtl':'ltr'}><ParticleBackground/><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-md relative z-10"><div className="glass-effect-strong rounded-3xl p-8 shadow-2xl"><div className="flex justify-end mb-3"><LanguageToggle/></div><div className="text-center mb-8"><motion.h1 initial={{scale:.9}} animate={{scale:1}} className="text-4xl font-bold gradient-text mb-2">WarHex</motion.h1><p className="text-gray-400">{t('welcome')}</p></div><form onSubmit={submit} className="space-y-4"><Input type="email" label="Email" placeholder={ar?'أدخل بريدك الإلكتروني':'Enter your email'} value={email} onChange={e=>setEmail(e.target.value)} icon={<Mail className="w-5 h-5"/>} fullWidth required/><Input type="password" label={ar?'كلمة المرور':'Password'} placeholder={ar?'أدخل كلمة المرور':'Enter your password'} value={password} onChange={e=>setPassword(e.target.value)} icon={<Lock className="w-5 h-5"/>} fullWidth required/><div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded"/><span className="text-gray-400">{ar?'تذكرني':'Remember me'}</span></label><Link href="/auth/forgot-password" className="text-blue-400">{ar?'نسيت كلمة المرور؟':'Forgot password?'}</Link></div>{error&&<p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}<Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>{t('signIn')}</Button></form><div className="my-6 flex items-center gap-4"><div className="flex-1 h-px bg-gray-700"/><span className="text-sm text-gray-500">{ar?'أو المتابعة عبر':'Or continue with'}</span><div className="flex-1 h-px bg-gray-700"/></div><div className="grid grid-cols-2 gap-4"><Button variant="ghost" onClick={()=>social('google')} icon={<GoogleIcon className="w-5 h-5"/>}>Google</Button><Button variant="ghost" onClick={()=>social('apple')} icon={<Apple className="w-5 h-5"/>}>Apple</Button></div><p className="text-center mt-6 text-gray-400">{ar?'ليس لديك حساب؟ ':'Don’t have an account? '}<Link href="/auth/signup" className="text-blue-400 font-semibold">{t('signUp')}</Link></p></div><p className="text-center text-gray-500 text-sm mt-6">{ar?'بمتابعتك، أنت توافق على ':'By continuing, you agree to our '}<Link href="/terms" className="text-blue-400">Terms</Link>{ar?' و ':' and '}<Link href="/privacy" className="text-blue-400">Privacy</Link>.</p></motion.div></div>;
}
