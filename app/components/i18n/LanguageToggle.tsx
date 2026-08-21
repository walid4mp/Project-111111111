'use client';
import { Languages } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold hover:bg-white/10" title="Change language">
    <Languages className="h-4 w-4 text-cyan-300"/><span className="hidden sm:inline">{language === 'ar' ? 'English' : 'العربية'}</span><span className="sm:hidden">{language === 'ar' ? 'EN' : 'AR'}</span>
  </button>;
}
