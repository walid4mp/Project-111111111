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
import { api } from '@/app/lib/client/api';
import { useLanguage } from '@/app/components/i18n/LanguageProvider';
import LanguageToggle from '@/app/components/i18n/LanguageToggle';

export default function SignupPage(){
  const {language,t}=useLanguage(); const router=useRouter(); const [username,setUsername]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const ar=language==='ar';
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError('');if(password.length<8){setError(ar?'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.':'Password must contain at least 8 characters.');return}setLoading(true);try{const r=await api<{needsEmailConfirmation:boolean}>('/api/auth/signup',{method:'POST',body:JSON.stringify({email,username,password})});router.push(r.needsEmailConfirmation?'/auth/login?message=confirm-email':'/profile')}catch(err){setError(err instanceof Error?err.message:(ar?'تعذر إنشاء الحساب.':'Unable to create account.'));setLoading(false)}};
  return <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" dir={ar?'rtl':'ltr'}><ParticleBackground/><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-md relative z-10"><div className="glass-effect-strong rounded-3xl p-8 shadow-2xl"><div className="flex justify-end mb-3"><LanguageToggle/></div><div className="text-center mb-8"><motion.h1 initial={{scale:.9}} animate={{scale:1}} className="text-4xl font-bold gradient-text mb-2">{t('createAccount')}</motion.h1><p className="text-gray-400">{ar?'انضم إلى مجتمع ألعاب WarHex.':'Join the WarHex gaming community.'}</p></div><form onSubmit={submit} className="space-y-4"><Input type="text" label={ar?'اسم المستخدم':'Username'} placeholder={ar?'اختر اسم مستخدم':'Choose a username'} value={username} onChange={e=>setUsername(e.target.value)} icon={<User className="w-5 h-5"/>} fullWidth required/><Input type="email" label="Email" placeholder={ar?'أدخل بريدك الإلكتروني':'Enter your email'} value={email} onChange={e=>setEmail(e.target.value)} icon={<Mail className="w-5 h-5"/>} fullWidth required/><Input type="password" label={ar?'كلمة المرور':'Password'} placeholder={ar?'أنشئ كلمة مرور':'Create a password'} value={password} onChange={e=>setPassword(e.target.value)} icon={<Lock className="w-5 h-5"/>} fullWidth required/>{error&&<p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</p>}<Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>{t('createAccount')}</Button></form><div className="my-6 flex items-center gap-4"><div className="flex-1 h-px bg-gray-700"/><span className="text-sm text-gray-500">{ar?'أو المتابعة عبر':'Or continue with'}</span><div className="flex-1 h-px bg-gray-700"/></div><div className="grid grid-cols-2 gap-4"><Button variant="ghost" icon={<GoogleIcon className="w-5 h-5"/>} onClick={()=>{window.location.href='/api/auth/oauth?provider=google'}} >Google</Button><Button variant="ghost" icon={<Apple className="w-5 h-5"/>} onClick={()=>{window.location.href='/api/auth/oauth?provider=apple'}}>Apple</Button></div><p className="text-center mt-6 text-gray-400">{ar?'لديك حساب بالفعل؟ ':'Already have an account? '}<Link href="/auth/login" className="text-blue-400 font-semibold">{t('signIn')}</Link></p></div></motion.div></div>;
}
