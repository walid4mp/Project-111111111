'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity, BarChart3, Bell, Bot, Boxes, CreditCard, Crown, FileText, Gamepad2, Gift,
  LayoutDashboard, LogOut, Megaphone, Package, Radio, RefreshCw, Save, Search, Settings,
  Shield, Trash2, UserCog, Users, Wallet, XCircle
} from 'lucide-react';
import { api } from '@/app/lib/client/api';

type Row = Record<string, unknown>;
type DashboardData = { counts: Record<string, number>; generatedAt: string };
type UserRow = { id: string; username?: string; email?: string; coins?: number; gems?: number; vip_level?: number; status?: string; created_at?: string };
type AdminRow = { id: string; user_id: string; email: string; role: 'ADMIN'|'SUPER_ADMIN'; permissions: string[]; active: boolean; scope: 'web'|'app'|'both'; created_at: string };
type SettingRow = { key: string; value: unknown };

type Section = { key: string; label: string; icon: typeof LayoutDashboard; endpoint: string; permission?: string };
const sections: Section[] = [
  {key:'dashboard',label:'نظرة عامة',icon:LayoutDashboard,endpoint:'/api/admin/dashboard'},
  {key:'users',label:'المستخدمون',icon:Users,endpoint:'/api/admin/users'},
  {key:'games',label:'الغرف والألعاب',icon:Gamepad2,endpoint:'/api/admin/control/games'},
  {key:'live',label:'البث المباشر',icon:Radio,endpoint:'/api/admin/control/live'},
  {key:'payments',label:'المدفوعات',icon:CreditCard,endpoint:'/api/admin/payments'},
  {key:'packages',label:'الباقات والمتجر',icon:Package,endpoint:'/api/admin/packages'},
  {key:'ads',label:'الإعلانات',icon:Megaphone,endpoint:'/api/admin/ads'},
  {key:'campaigns',label:'الحملات',icon:Activity,endpoint:'/api/admin/campaigns'},
  {key:'notifications',label:'الإشعارات',icon:Bell,endpoint:'/api/admin/notifications'},
  {key:'vip',label:'VIP',icon:Crown,endpoint:'/api/admin/vip'},
  {key:'analytics',label:'تحليلات الإعلانات',icon:BarChart3,endpoint:'/api/admin/analytics'},
  {key:'reports',label:'التقارير',icon:FileText,endpoint:'/api/admin/reports'},
  {key:'logs',label:'سجل الإدارة',icon:Shield,endpoint:'/api/admin/logs'},
  {key:'admins',label:'المشرفون والصلاحيات',icon:UserCog,endpoint:'/api/admin/admins'},
  {key:'settings',label:'إعدادات التطبيق',icon:Settings,endpoint:'/api/admin/settings'},
];
const PERMISSIONS = ['dashboard','users','campaigns','payments','packages','rewards_ads','notifications','ad_analytics','vip_pro','reports','admin_logs','settings','admin_manage','user_points','user_moderation','password_reset','payment_review','live_control','game_control'];

function money(value: unknown) { return `${Number(value || 0).toFixed(2)} $`; }
function shortDate(value: unknown) { return value ? new Date(String(value)).toLocaleString('ar-DZ') : '—'; }

export default function AdminDashboardClient() {
  const [active, setActive] = useState('dashboard');
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const section = useMemo(() => sections.find(s => s.key === active) || sections[0], [active]);

  async function load() {
    setLoading(true); setError('');
    try { setData(await api<unknown>(section.endpoint)); }
    catch (e) { setError(e instanceof Error ? e.message : 'تعذر تحميل البيانات'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [section.endpoint]);

  async function logout() { localStorage.removeItem('warhex_admin_access_token'); localStorage.removeItem('warhex_admin_refresh_token'); window.location.href='/login'; }

  return <main dir="rtl" className="min-h-screen bg-[#050816] text-white">
    <div className="flex min-h-screen">
      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l border-white/10 bg-slate-950/95 p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 px-2 py-3 mb-4"><img src="/icon-192.png" alt="WarHex" className="h-12 w-12 rounded-2xl"/><div><div className="font-black text-xl">WARHEX</div><div className="text-xs text-cyan-300">SUPER ADMIN</div></div></div>
        <div className="space-y-1">{sections.map(s=>{const Icon=s.icon;return <button key={s.key} onClick={()=>{setActive(s.key);setQuery('')}} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-right transition ${active===s.key?'bg-gradient-to-l from-cyan-500/20 to-violet-500/20 text-cyan-200 border border-cyan-400/10':'text-slate-300 hover:bg-white/5'}`}><Icon className="h-4 w-4"/>{s.label}</button>})}</div>
        <div className="mt-auto pt-4"><button onClick={()=>void logout()} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-300 hover:bg-red-500/10"><LogOut className="h-4 w-4"/>تسجيل الخروج</button></div>
      </aside>
      <section className="flex-1 min-w-0 p-4 md:p-7">
        <header className="sticky top-0 z-20 mb-5 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-4">
          <div className="flex flex-wrap items-center gap-3"><div className="flex-1"><div className="text-[10px] tracking-[.3em] text-cyan-300">WARHEX CONTROL CENTER</div><h1 className="text-2xl md:text-3xl font-black mt-1">{section.label}</h1><p className="text-sm text-slate-400 mt-1">إدارة كاملة للمستخدمين والألعاب والبث والدفع والإعلانات والإعدادات.</p></div><button onClick={()=>void load()} className="rounded-xl border border-white/10 p-3 hover:bg-white/5" title="تحديث"><RefreshCw className={loading?'animate-spin':''}/></button></div>
          <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-1">{sections.map(s=><button key={s.key} onClick={()=>setActive(s.key)} className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm ${active===s.key?'bg-cyan-500/20 text-cyan-200':'bg-white/5 text-slate-300'}`}>{s.label}</button>)}</div>
        </header>
        {error && <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200 flex items-center gap-2"><XCircle className="h-5 w-5"/>{error}</div>}
        {loading ? <div className="min-h-64 grid place-items-center text-slate-400"><RefreshCw className="animate-spin mb-2"/>جاري التحميل…</div> : <Content section={section.key} data={data} query={query} setQuery={setQuery} reload={load}/>} 
      </section>
    </div>
  </main>;
}

function Cards({counts}:{counts:Record<string,number>}) { const cards=[['profiles','المستخدمون',Users],['game_rooms','غرف الألعاب',Gamepad2],['live_rooms','غرف البث',Radio],['payment_orders','طلبات الدفع',Wallet],['ads','الإعلانات',Megaphone],['store_items','عناصر المتجر',Package],['admin_logs','عمليات الإدارة',Shield]] as const; return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([key,label,Icon])=><div key={key} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><Icon className="h-5 w-5 text-cyan-300"/><div className="text-xs text-slate-400 mt-4">{label}</div><div className="text-3xl font-black mt-1">{counts[key] ?? 0}</div></div>)}</div>; }

function Content({section,data,query,setQuery,reload}:{section:string;data:unknown;query:string;setQuery:(v:string)=>void;reload:()=>Promise<void>}) {
  if(section==='dashboard') return <Dashboard data={data}/>;
  if(section==='users') return <UsersPanel data={data} query={query} setQuery={setQuery} reload={reload}/>;
  if(section==='admins') return <AdminsPanel data={data} reload={reload}/>;
  if(section==='payments') return <PaymentsPanel data={data} reload={reload}/>;
  if(section==='settings') return <SettingsPanel data={data} reload={reload}/>;
  if(section==='notifications') return <NotificationsPanel reload={reload}/>;
  if(section==='campaigns') return <CampaignsPanel reload={reload}/>;
  if(section==='ads') return <AdsPanel data={data} reload={reload}/>;
  if(section==='games' || section==='live') return <RoomsPanel section={section} data={data} reload={reload}/>;
  return <GenericPanel data={data} query={query} setQuery={setQuery}/>;
}
function Dashboard({data}:{data:unknown}) { const d=(data||{}) as DashboardData; return <div className="space-y-5"><Cards counts={d.counts||{}}/><div className="grid gap-4 lg:grid-cols-3"><QuickCard icon={Bot} title="مراقبة النظام" text="الإدارة محمية بصلاحيات السيرفر، وSUPER_ADMIN يتجاوز الصلاحيات الفرعية."/><QuickCard icon={Boxes} title="إدارة كاملة" text="يمكن تعديل المستخدمين، الدفع، الباقات، الإعلانات، الغرف والإعدادات من هذه اللوحة."/><QuickCard icon={Shield} title="الأمان" text="كل طلب Admin يمر عبر جلسة Supabase وصلاحية محددة، وليس عبر إخفاء الأزرار فقط."/></div></div> }
function QuickCard({icon:Icon,title,text}:{icon:typeof Bot;title:string;text:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><Icon className="h-6 w-6 text-violet-300"/><h3 className="font-bold mt-4">{title}</h3><p className="text-sm text-slate-400 mt-2 leading-6">{text}</p></div>}

function UsersPanel({data,query,setQuery,reload}:{data:unknown;query:string;setQuery:(v:string)=>void;reload:()=>Promise<void>}) { const rows=((data as {users?:UserRow[]})?.users||[]).filter(u=>`${u.username||''} ${u.email||''}`.toLowerCase().includes(query.toLowerCase())); return <div className="space-y-4"><div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[.03] p-3"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث باسم المستخدم أو البريد…" className="bg-transparent outline-none flex-1"/></div><div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5 text-slate-400"><tr><th className="p-3 text-right">المستخدم</th><th className="p-3">الحالة</th><th className="p-3">Coins</th><th className="p-3">Gems</th><th className="p-3">VIP</th><th className="p-3">إجراء</th></tr></thead><tbody>{rows.map(u=><UserLine key={u.id} user={u} reload={reload}/> )}</tbody></table></div></div> }
function UserLine({user,reload}:{user:UserRow;reload:()=>Promise<void>}) { const [busy,setBusy]=useState(false); const [coins,setCoins]=useState(String(user.coins??0)); const [gems,setGems]=useState(String(user.gems??0)); const [vip,setVip]=useState(String(user.vip_level??0)); async function save(){setBusy(true);try{await api('/api/admin/users',{method:'PATCH',body:JSON.stringify({id:user.id,coins:Number(coins),gems:Number(gems),vip_level:Number(vip)})});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل التعديل')}finally{setBusy(false)}} async function mod(action:string){setBusy(true);try{await api('/api/admin/control',{method:'POST',body:JSON.stringify({userId:user.id,action})});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل الإجراء')}finally{setBusy(false)}} return <tr className="border-t border-white/5"><td className="p-3"><div className="font-bold">{user.username||'بدون اسم'}</div><div className="text-xs text-slate-500">{user.email||user.id}</div></td><td className="p-3">{user.status||'ACTIVE'}</td><td className="p-3"><input className="w-24 rounded-lg bg-slate-900 border border-white/10 p-2" value={coins} onChange={e=>setCoins(e.target.value)}/></td><td className="p-3"><input className="w-24 rounded-lg bg-slate-900 border border-white/10 p-2" value={gems} onChange={e=>setGems(e.target.value)}/></td><td className="p-3"><input className="w-16 rounded-lg bg-slate-900 border border-white/10 p-2" value={vip} onChange={e=>setVip(e.target.value)}/></td><td className="p-3"><div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>void save()} className="rounded-lg bg-cyan-600 px-3 py-2"><Save className="h-4 w-4"/></button><button disabled={busy} onClick={()=>void mod(user.status==='BANNED'?'unban':'ban')} className="rounded-lg bg-red-500/15 text-red-300 px-3 py-2">{user.status==='BANNED'?'فك الحظر':'حظر'}</button><button disabled={busy} onClick={()=>void mod(user.status==='FROZEN'?'unban':'freeze')} className="rounded-lg bg-amber-500/15 text-amber-300 px-3 py-2">{user.status==='FROZEN'?'تنشيط':'تجميد'}</button></div></td></tr> }

function PaymentsPanel({data,reload}:{data:unknown;reload:()=>Promise<void>}) { const rows=((data as {payments?:Row[]})?.payments||[]); return <DataTable rows={rows} fields={['id','amount','currency','status','created_at']} actions={r=><select defaultValue={String(r.status||'pending')} onChange={async e=>{try{await api('/api/admin/payments',{method:'PATCH',body:JSON.stringify({id:r.id,status:e.target.value})});await reload()}catch(err){alert(err instanceof Error?err.message:'فشل')}}} className="rounded-lg bg-slate-900 border border-white/10 p-2"><option>pending</option><option>captured</option><option>approved</option><option>rejected</option><option>cancelled</option></select>}/> }
function RoomsPanel({section,data,reload}:{section:string;data:unknown;reload:()=>Promise<void>}) { const rows=((section==='games'?(data as {games?:Row[]})?.games:(data as {rooms?:Row[]})?.rooms)||[]); return <DataTable rows={rows} fields={['id','status','host_id','guest_id','created_at','updated_at']} actions={r=><button onClick={async()=>{try{await api(section==='games'?'/api/admin/control/games':'/api/admin/control/live',{method:'POST',body:JSON.stringify({id:r.id,status:'ended'})});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل')}}} className="rounded-lg bg-red-500/15 text-red-300 px-3 py-2">إنهاء</button>}/> }
function AdsPanel({data,reload}:{data:unknown;reload:()=>Promise<void>}) { const rows=((data as {ads?:Row[]})?.ads||[]); return <DataTable rows={rows} fields={['id','title','placement','priority','active','created_at']} actions={r=><button onClick={async()=>{try{await api('/api/admin/ads',{method:'PATCH',body:JSON.stringify({id:r.id,active:!Boolean(r.active)})});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل')}}} className="rounded-lg bg-cyan-500/15 text-cyan-200 px-3 py-2">{r.active?'إيقاف':'تفعيل'}</button>}/> }
function SettingsPanel({data,reload}:{data:unknown;reload:()=>Promise<void>}) { const rows=((data as {settings?:SettingRow[]})?.settings||[]); return <div className="grid gap-3 md:grid-cols-2">{rows.map(s=><SettingEditor key={s.key} setting={s} reload={reload}/>)}</div> }
function SettingEditor({setting,reload}:{setting:SettingRow;reload:()=>Promise<void>}) { const [value,setValue]=useState(typeof setting.value==='string'?setting.value:JSON.stringify(setting.value)); return <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4"><div className="text-sm font-bold mb-2">{setting.key}</div><textarea value={value} onChange={e=>setValue(e.target.value)} className="w-full min-h-20 rounded-xl bg-slate-950 border border-white/10 p-3 font-mono text-xs"/><button onClick={async()=>{try{const parsed=JSON.parse(value);await api('/api/admin/settings',{method:'PATCH',body:JSON.stringify({key:setting.key,value:parsed})});await reload()}catch{alert('القيمة يجب أن تكون JSON صالحاً مثل true أو "en" أو 123')}}} className="mt-3 rounded-xl bg-cyan-600 px-4 py-2">حفظ</button></div> }
function NotificationsPanel({reload}:{reload:()=>Promise<void>}) { const [title,setTitle]=useState('');const [body,setBody]=useState('');const [target,setTarget]=useState('all');return <FormCard title="إرسال إشعار"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="العنوان" className="field"/><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="نص الإشعار" className="field min-h-28"/><select value={target} onChange={e=>setTarget(e.target.value)} className="field"><option value="all">الجميع</option><option value="vip">VIP</option><option value="online">المتصلون</option></select><button onClick={async()=>{try{await api('/api/admin/notifications',{method:'POST',body:JSON.stringify({title,body,target})});setTitle('');setBody('');await reload()}catch(e){alert(e instanceof Error?e.message:'فشل الإرسال')}}} className="btn">إرسال</button></FormCard> }
function CampaignsPanel({reload}:{reload:()=>Promise<void>}) { const [name,setName]=useState('');const [budget,setBudget]=useState('0');return <FormCard title="إنشاء حملة"><input value={name} onChange={e=>setName(e.target.value)} placeholder="اسم الحملة" className="field"/><input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="الميزانية" type="number" className="field"/><button onClick={async()=>{try{await api('/api/admin/campaigns',{method:'POST',body:JSON.stringify({name,budget:Number(budget)})});setName('');await reload()}catch(e){alert(e instanceof Error?e.message:'فشل')}}} className="btn">إنشاء</button></FormCard> }
function FormCard({title,children}:{title:string;children:React.ReactNode}) { return <div className="max-w-2xl rounded-2xl border border-white/10 bg-white/[.04] p-5 space-y-3"><h2 className="font-bold text-lg">{title}</h2>{children}</div> }
function AdminsPanel({data,reload}:{data:unknown;reload:()=>Promise<void>}) { const rows=((data as {admins?:AdminRow[]})?.admins||[]);const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [scope,setScope]=useState<'web'|'app'|'both'>('web');async function create(){try{await api('/api/admin/admins',{method:'POST',body:JSON.stringify({email,password,scope,permissions:PERMISSIONS})});setEmail('');setPassword('');await reload()}catch(e){alert(e instanceof Error?e.message:'فشل إنشاء المشرف')}} return <div className="space-y-5"><FormCard title="إضافة مشرف جديد"><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" type="email" className="field"/><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة مرور 8 أحرف على الأقل" type="password" className="field"/><select value={scope} onChange={e=>setScope(e.target.value as 'web'|'app'|'both')} className="field"><option value="web">لوحة الويب</option><option value="app">التطبيق</option><option value="both">كلاهما</option></select><button onClick={()=>void create()} className="btn">إنشاء مشرف كامل الصلاحيات</button></FormCard><DataTable rows={rows} fields={['email','role','scope','active','created_at']} actions={r=><div className="flex gap-2"><button onClick={async()=>{try{await api('/api/admin/admins',{method:'PATCH',body:JSON.stringify({id:r.id,active:!Boolean(r.active)})});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل')}}} className="rounded-lg bg-cyan-500/15 text-cyan-200 px-3 py-2">{r.active?'تعطيل':'تفعيل'}</button><button onClick={async()=>{if(!confirm('حذف المشرف وحساب Auth؟'))return;try{await api(`/api/admin/admins?id=${encodeURIComponent(String(r.id))}`,{method:'DELETE'});await reload()}catch(e){alert(e instanceof Error?e.message:'فشل الحذف')}}} className="rounded-lg bg-red-500/15 text-red-300 px-3 py-2"><Trash2 className="h-4 w-4"/></button></div>}/></div> }
function DataTable({rows,fields,actions}:{rows:Row[];fields:string[];actions?:(row:Row)=>React.ReactNode}) { return <div className="overflow-x-auto rounded-2xl border border-white/10"><table className="w-full text-sm"><thead className="bg-white/5"><tr>{fields.map(f=><th key={f} className="p-3 text-right whitespace-nowrap">{f}</th>)}{actions&&<th className="p-3">إجراءات</th>}</tr></thead><tbody>{rows.map((r,i)=><tr key={String(r.id??i)} className="border-t border-white/5">{fields.map(f=><td key={f} className="p-3 max-w-xs truncate" title={String(r[f]??'')}>{f==='amount'?money(r[f]):f==='created_at'||f==='updated_at'?shortDate(r[f]):typeof r[f]==='object'?JSON.stringify(r[f]):String(r[f]??'—')}</td>)}{actions&&<td className="p-3">{actions(r)}</td>}</tr>)}</tbody></table>{rows.length===0&&<div className="p-8 text-center text-slate-500">لا توجد بيانات</div>}</div> }
function GenericPanel({data,query,setQuery}:{data:unknown;query:string;setQuery:(v:string)=>void}) { const raw=JSON.stringify(data||{},null,2);return <div className="space-y-3"><div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[.03] p-3"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="بحث داخل البيانات…" className="bg-transparent outline-none flex-1"/></div><pre className="rounded-2xl border border-white/10 bg-black/20 p-5 text-xs text-slate-300 whitespace-pre-wrap overflow-auto max-h-[65vh]">{query?raw.split('\n').filter(line=>line.toLowerCase().includes(query.toLowerCase())).join('\n'):raw}</pre></div> }
