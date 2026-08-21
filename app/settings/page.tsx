'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, LogOut, Save, Shield, SlidersHorizontal, Volume2, Bell } from 'lucide-react';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { getSettings, saveSettings, type WarHexSettings } from '@/app/lib/storage';
import { api } from '@/app/lib/client/api';
import { useRouter } from 'next/navigation';

const rows: Array<{ key: keyof WarHexSettings; title: string; description: string; icon: typeof Bell }> = [
  { key: 'notifications', title: 'Notifications', description: 'Tournament reminders, gifts and social activity.', icon: Bell },
  { key: 'sound', title: 'Game Sound', description: 'Enable sounds and game feedback.', icon: Volume2 },
  { key: 'haptics', title: 'Haptics', description: 'Use vibration feedback on supported devices.', icon: SlidersHorizontal },
  { key: 'publicProfile', title: 'Public Profile', description: 'Allow other players to view your profile.', icon: Shield },
  { key: 'showOnlineStatus', title: 'Online Status', description: 'Show your online presence to friends.', icon: Check },
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<WarHexSettings>(() => getSettings());
  const [saved, setSaved] = useState(false);


  const update = (key: keyof WarHexSettings, value: boolean | 'en' | 'ar') => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    saveSettings(settings);
    try { await api('/api/profile/settings', { method: 'PATCH', body: JSON.stringify(settings) }); } catch {}
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const logout = async () => {
    try { await api('/api/auth/logout', { method: 'POST' }); } finally { router.push('/auth/login'); }
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass-effect-strong border-b border-white/10">
        <div className="max-w-screen-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-400">Your preferences are saved to your WarHex account.</p>
          </div>
          <Button variant="primary" size="sm" onClick={save}>
            <Save className="w-4 h-4 mr-1" /> {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-6 space-y-6">
        <Card variant="premium">
          <h2 className="text-lg font-bold mb-4">Preferences</h2>
          <div className="divide-y divide-white/10">
            {rows.map(({ key, title, description, icon: Icon }) => (
              <div key={key} className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-gray-400">{description}</p>
                </div>
                <button
                  type="button"
                  aria-label={title}
                  aria-pressed={Boolean(settings[key])}
                  onClick={() => update(key, !settings[key] as boolean)}
                  className={`w-12 h-7 rounded-full transition-colors ${settings[key] ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform mx-1 ${settings[key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="premium">
          <h2 className="text-lg font-bold mb-4">Language</h2>
          <div className="grid grid-cols-2 gap-3">
            {(['en', 'ar'] as const).map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => update('language', language)}
                className={`rounded-xl border p-3 font-semibold ${settings.language === language ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}
              >
                {language === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </Card>

        <Card variant="glass">
          <Link href="/privacy" className="flex items-center justify-between py-2">
            <span className="font-semibold">Privacy Policy</span><ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
          <Link href="/terms" className="flex items-center justify-between py-4">
            <span className="font-semibold">Terms of Service</span><ChevronRight className="w-5 h-5 text-gray-500" />
          </Link>
        </Card>

        <Button variant="danger" fullWidth onClick={logout}>
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </Button>
      </main>
    </div>
  );
}
