'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'ar';
type ContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: string) => string };
const translations: Record<Language, Record<string,string>> = {
  en: { home:'Home', games:'Games', live:'Live', chat:'Chat', profile:'Profile', language:'Language', arabic:'العربية', english:'English', signIn:'Sign in', signUp:'Sign up', online:'Online', createAccount:'Create Account', welcome:'Welcome back, Warrior!' },
  ar: { home:'الرئيسية', games:'الألعاب', live:'بث مباشر', chat:'المحادثات', profile:'الملف الشخصي', language:'اللغة', arabic:'العربية', english:'English', signIn:'تسجيل الدخول', signUp:'إنشاء حساب', online:'متصل', createAccount:'إنشاء حساب', welcome:'مرحبًا بعودتك أيها المحارب!' }
};
const Ctx = createContext<ContextValue>({ language:'en', setLanguage:()=>{}, t:k=>translations.en[k] ?? k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('warhex-language') as Language | null;
    return saved === 'ar' || saved === 'en' ? saved : (navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en');
  });
  useEffect(() => {
    localStorage.setItem('warhex-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage: (next:Language) => setLanguageState(next), t:(key:string) => translations[language][key] ?? translations.en[key] ?? key }), [language]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useLanguage() { return useContext(Ctx); }
