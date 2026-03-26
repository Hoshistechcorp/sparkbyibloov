import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Calendar, FileText, Image,
  BarChart3, Users, BookOpen, X, Menu, LogOut, Settings, TrendingUp,
  Globe, MapPin, ArrowUpRight, ArrowDownRight, Search, Filter
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

type Tab = 'dashboard' | 'events' | 'blog' | 'programs' | 'media' | 'users' | 'settings';

const BRAND = '#ec9f00';
const BRAND_DARK = '#c48500';
const BRAND_LIGHT = '#ec9f00';

const SparkAdmin = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      }
      setLoading(false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      } else { setUser(null); setIsAdmin(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-[Nunito] bg-[#0f0f12]">
      <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center font-[Nunito] bg-[#0f0f12] px-4">
      <div className="text-center">
        <img src={sparkLogo} alt="Spark" className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6" />
        <h1 className="text-xl md:text-2xl font-extrabold text-white mb-2">Spark Admin</h1>
        <p className="text-gray-500 mb-6 text-sm">Please sign in to access the admin panel.</p>
        <Link to="/spark/auth" className="bg-[#ec9f00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full hover:bg-[#d48e00] transition-all">Sign In</Link>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center font-[Nunito] bg-[#0f0f12] px-4">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-extrabold text-white mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 text-sm">You don't have admin privileges for Spark.</p>
        <Link to="/spark" className="text-[#ec9f00] font-bold hover:underline">← Back to Spark</Link>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (id: Tab) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <>
      <SEOHead title="Spark Admin" description="Manage Spark content, events, and programs." />
      <div className="bg-[#0f0f12] text-white min-h-screen font-[Nunito]">
        {/* Top nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-[#16161d] border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-1 text-gray-500 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <img src={sparkLogo} alt="Spark" className="h-7 w-7" />
            <span className="text-xs font-black tracking-[0.15em] uppercase text-white/80">Spark<span className="text-[#ec9f00] ml-1">Admin</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <input placeholder="Search..." className="bg-transparent text-xs text-white/60 outline-none w-32 placeholder:text-gray-600" />
            </div>
            <div className="h-7 w-7 rounded-full bg-[#ec9f00]/20 flex items-center justify-center text-[10px] font-bold text-[#ec9f00]">
              {user.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <Link to="/spark" className="text-[10px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#d48e00] transition-colors hidden sm:block">Site →</Link>
            <button onClick={handleLogout} className="p-1.5 text-gray-500 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>

        <div className="pt-14 flex">
          {/* Sidebar */}
          {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
          <aside className={`fixed left-0 top-14 bottom-0 w-56 bg-[#16161d] border-r border-white/5 z-40 transition-transform duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex-1 p-3 space-y-0.5 pt-4">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${activeTab === tab.id ? 'bg-[#ec9f00]/10 text-[#ec9f00]' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-white/5">
              <div className="bg-[#ec9f00]/5 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#ec9f00] mb-1">Spark Pro</p>
                <p className="text-[11px] text-gray-500">Advanced analytics & AI insights</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="md:ml-56 flex-1 p-4 md:p-6 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'events' && <EventsTab />}
                {activeTab === 'blog' && <BlogTab />}
                {activeTab === 'programs' && <ProgramsTab />}
                {activeTab === 'media' && <MediaTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

/* ─── DASHBOARD ─── */
const engagementData = [
  { month: 'Jan', learners: 120, events: 8, posts: 12 },
  { month: 'Feb', learners: 180, events: 12, posts: 15 },
  { month: 'Mar', learners: 240, events: 15, posts: 18 },
  { month: 'Apr', learners: 310, events: 20, posts: 22 },
  { month: 'May', learners: 420, events: 18, posts: 28 },
  { month: 'Jun', learners: 580, events: 25, posts: 32 },
];

const eventTypeData = [
  { name: 'Workshop', value: 40, color: '#ec9f00' },
  { name: 'Bootcamp', value: 25, color: '#7B61FF' },
  { name: 'Conference', value: 20, color: '#FF6B35' },
  { name: 'Meetup', value: 15, color: '#00C896' },
];

const programEnrollmentData = [
  { name: 'Architect', enrolled: 245 },
  { name: 'Plotter', enrolled: 189 },
  { name: 'Alchemist', enrolled: 312 },
  { name: 'Gatekeeper', enrolled: 156 },
  { name: 'Voice', enrolled: 278 },
  { name: 'Narrator', enrolled: 420 },
  { name: 'Lens', enrolled: 198 },
  { name: 'Selector', enrolled: 267 },
];

const DashboardTab = () => {
  const { data: eventsCount = 0 } = useQuery({ queryKey: ['admin-events-count'], queryFn: async () => { const { count } = await supabase.from('spark_events').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: postsCount = 0 } = useQuery({ queryKey: ['admin-posts-count'], queryFn: async () => { const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: usersCount = 0 } = useQuery({ queryKey: ['admin-users-count'], queryFn: async () => { const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); return count || 0; } });

  const stats = [
    { label: 'Total Learners', value: usersCount, change: '+18%', up: true, icon: Users, color: '#ec9f00' },
    { label: 'Active Events', value: eventsCount, change: '+12%', up: true, icon: Calendar, color: '#7B61FF' },
    { label: 'Blog Posts', value: postsCount, change: '+24%', up: true, icon: FileText, color: '#FF6B35' },
    { label: 'Programs', value: 8, change: '0%', up: true, icon: BookOpen, color: '#00C896' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white mb-1">Overview</h2>
        <p className="text-sm text-gray-500">Welcome back. Here's what's happening with Spark.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-[#1c1c26] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + '15' }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] font-bold ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Engagement trend */}
        <div className="lg:col-span-2 bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Learner Growth</h3>
              <p className="text-[11px] text-gray-500">Monthly engagement trend</p>
            </div>
            <div className="flex gap-4 text-[10px] font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ec9f00]" />Learners</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7B61FF]" />Events</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorLearners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec9f00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec9f00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12, color: '#fff' }} />
              <Area type="monotone" dataKey="learners" stroke="#ec9f00" fill="url(#colorLearners)" strokeWidth={2} />
              <Area type="monotone" dataKey="events" stroke="#7B61FF" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Event types pie */}
        <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-white mb-1">Event Types</h3>
          <p className="text-[11px] text-gray-500 mb-4">Distribution by category</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={eventTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {eventTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {eventTypeData.map(e => (
              <div key={e.name} className="flex items-center gap-2 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name} ({e.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program enrollments bar chart */}
      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Program Enrollments</h3>
            <p className="text-[11px] text-gray-500">Total enrolled per program</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={programEnrollmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12, color: '#fff' }} />
            <Bar dataKey="enrolled" fill="#ec9f00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg bg-[#ec9f00]/10 text-[#ec9f00] hover:bg-[#ec9f00]/20 transition-colors">+ Create Event</button>
          <button className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF]/20 transition-colors">+ Write Post</button>
          <button className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20 transition-colors">+ Upload Media</button>
          <button className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg bg-[#00C896]/10 text-[#00C896] hover:bg-[#00C896]/20 transition-colors">View Analytics</button>
        </div>
      </div>
    </div>
  );
};

/* ─── EVENTS ─── */
const EventsTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', cover_image_url: '', event_type: 'workshop', is_virtual: false, registration_url: '', published: false });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-spark-events'],
    queryFn: async () => { const { data } = await supabase.from('spark_events').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (editingEvent) {
        const { error } = await supabase.from('spark_events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spark_events').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-events'] }); queryClient.invalidateQueries({ queryKey: ['admin-events-count'] }); setShowForm(false); setEditingEvent(null); resetForm(); toast.success('Event saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_events').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-events'] }); queryClient.invalidateQueries({ queryKey: ['admin-events-count'] }); toast.success('Event deleted'); },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from('spark_events').update({ published: !published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-events'] }); toast.success('Status updated'); },
  });

  const resetForm = () => setForm({ title: '', description: '', date: '', location: '', cover_image_url: '', event_type: 'workshop', is_virtual: false, registration_url: '', published: false });

  const openEdit = (e: any) => {
    setEditingEvent(e);
    setForm({ title: e.title, description: e.description || '', date: e.date ? format(new Date(e.date), "yyyy-MM-dd'T'HH:mm") : '', location: e.location || '', cover_image_url: e.cover_image_url || '', event_type: e.event_type, is_virtual: e.is_virtual, registration_url: e.registration_url || '', published: e.published });
    setShowForm(true);
  };

  const filtered = events.filter((e: any) => e.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Events</h2>
          <p className="text-sm text-gray-500">{events.length} total events</p>
        </div>
        <button onClick={() => { resetForm(); setEditingEvent(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <div className="flex items-center gap-2 bg-[#1c1c26] rounded-lg px-3 py-2 border border-white/5">
        <Search className="w-4 h-4 text-gray-500" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search events..." className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-600" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none">
              <option value="workshop">Workshop</option><option value="bootcamp">Bootcamp</option><option value="conference">Conference</option><option value="meetup">Meetup</option>
            </select>
            <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <input placeholder="Registration URL" value={form.registration_url} onChange={e => setForm({ ...form, registration_url: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 md:col-span-2 focus:border-[#ec9f00]/50 outline-none" rows={3} />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.is_virtual} onChange={e => setForm({ ...form, is_virtual: e.target.checked })} className="rounded accent-[#ec9f00]" /> Virtual</label>
              <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded accent-[#ec9f00]" /> Published</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.date} className="bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">
              {editingEvent ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="text-gray-500 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-white">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-1.5">
        {filtered.map((e: any) => (
          <div key={e.id} className="bg-[#1c1c26] rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => togglePublish.mutate({ id: e.id, published: e.published })} className="p-1 hover:bg-white/5 rounded transition-colors">
                {e.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
              </button>
              <div className="min-w-0">
                <p className="font-bold text-sm text-white truncate">{e.title}</p>
                <p className="text-[11px] text-gray-500 truncate">
                  <span className="text-[#ec9f00]/60">{e.event_type}</span> · {e.date ? format(new Date(e.date), 'MMM dd, yyyy') : 'No date'}
                  {e.location && <> · <MapPin className="w-3 h-3 inline" /> {e.location}</>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(e)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { if (confirm('Delete this event?')) deleteMutation.mutate(e.id); }} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No events found.</p>}
      </div>
    </div>
  );
};

/* ─── BLOG ─── */
const BlogTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author_name: 'Spark Team', category: 'news', published: false });

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => { const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = { ...form, slug, published_at: form.published ? new Date().toISOString() : null };
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); queryClient.invalidateQueries({ queryKey: ['admin-posts-count'] }); setShowForm(false); setEditingPost(null); resetForm(); toast.success('Post saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('blog_posts').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); queryClient.invalidateQueries({ queryKey: ['admin-posts-count'] }); toast.success('Post deleted'); },
  });

  const resetForm = () => setForm({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author_name: 'Spark Team', category: 'news', published: false });

  const openEdit = (p: any) => {
    setEditingPost(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content, cover_image_url: p.cover_image_url || '', author_name: p.author_name, category: p.category, published: p.published });
    setShowForm(true);
  };

  const filtered = posts.filter((p: any) => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Blog Posts</h2>
          <p className="text-sm text-gray-500">{posts.length} total posts</p>
        </div>
        <button onClick={() => { resetForm(); setEditingPost(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="flex items-center gap-2 bg-[#1c1c26] rounded-lg px-3 py-2 border border-white/5">
        <Search className="w-4 h-4 text-gray-500" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search posts..." className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-600" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">{editingPost ? 'Edit Post' : 'Create Post'}</h3>
            <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Post title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <input placeholder="Author name" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none">
              <option value="news">News</option><option value="spotlight">Learner Spotlight</option><option value="industry">Industry Insights</option><option value="update">Program Update</option>
            </select>
            <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 md:col-span-2 focus:border-[#ec9f00]/50 outline-none" />
            <textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 md:col-span-2 focus:border-[#ec9f00]/50 outline-none" rows={2} />
            <textarea placeholder="Content (full article — supports markdown)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 md:col-span-2 focus:border-[#ec9f00]/50 outline-none font-mono" rows={8} />
            <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded accent-[#ec9f00]" /> Publish now</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.content} className="bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">
              {editingPost ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="text-gray-500 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-white">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-1.5">
        {filtered.map((p: any) => (
          <div key={p.id} className="bg-[#1c1c26] rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              {p.published ? <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <EyeOff className="w-4 h-4 text-gray-600 flex-shrink-0" />}
              <div className="min-w-0">
                <p className="font-bold text-sm text-white truncate">{p.title}</p>
                <p className="text-[11px] text-gray-500 truncate">
                  <span className="text-[#ec9f00]/60">{p.category}</span> · {p.author_name}{p.published_at ? ` · ${format(new Date(p.published_at), 'MMM dd')}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(p)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(p.id); }} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No posts found.</p>}
      </div>
    </div>
  );
};

/* ─── PROGRAMS ─── */
const programsList = [
  { name: 'The Architect', real: 'Advanced Event Planning', enrolled: 245, status: 'active', color: '#ec9f00' },
  { name: 'Da Plotter', real: 'Professional Tourist Guide', enrolled: 189, status: 'active', color: '#7B61FF' },
  { name: 'The Alchemist', real: 'Mixology & Bartending', enrolled: 312, status: 'active', color: '#FF6B35' },
  { name: 'The Gatekeeper', real: 'Concierge & Waitstaff', enrolled: 156, status: 'active', color: '#00C896' },
  { name: 'The Voice', real: 'MC Bootcamp', enrolled: 278, status: 'active', color: '#FF3366' },
  { name: 'The Narrator', real: 'TikTok Content', enrolled: 420, status: 'active', color: '#ec9f00' },
  { name: 'The Lens', real: 'Photo & Video', enrolled: 198, status: 'active', color: '#7B61FF' },
  { name: 'The Selector', real: 'DJ Arts & Music', enrolled: 267, status: 'active', color: '#FF6B35' },
];

const ProgramsTab = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-extrabold text-white">Programs</h2>
      <p className="text-sm text-gray-500">8 active micro-credential programs</p>
    </div>
    <div className="space-y-1.5">
      {programsList.map((p, i) => (
        <div key={p.name} className="bg-[#1c1c26] rounded-xl px-4 py-4 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-gray-600 font-mono w-5">0{i + 1}</span>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <div>
              <p className="text-sm font-bold text-white">{p.name}</p>
              <p className="text-[11px] text-gray-500">{p.real}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{p.enrolled}</p>
              <p className="text-[10px] text-gray-500">enrolled</p>
            </div>
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">Active</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── MEDIA ─── */
const MediaTab = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-white">Media Gallery</h2>
        <p className="text-sm text-gray-500">Manage photos and videos</p>
      </div>
      <button className="flex items-center gap-2 bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors">
        <Plus className="w-4 h-4" /> Upload
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop',
      ].map((src, i) => (
        <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-[#1c1c26] border border-white/5 hover:border-[#ec9f00]/30 transition-colors cursor-pointer">
          <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30"><Pencil className="w-4 h-4 text-white" /></button>
              <button className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-red-500/50"><Trash2 className="w-4 h-4 text-white" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-[#1c1c26] rounded-xl p-8 border border-white/5 border-dashed text-center cursor-pointer hover:border-[#ec9f00]/30 transition-colors">
      <Image className="w-10 h-10 text-gray-600 mx-auto mb-2" />
      <p className="text-sm text-gray-500">Drop files here or click to upload</p>
      <p className="text-[11px] text-gray-600">JPG, PNG, MP4 up to 50MB</p>
    </div>
  </div>
);

/* ─── USERS ─── */
const UsersTab = () => {
  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-white">Users</h2>
        <p className="text-sm text-gray-500">{profiles.length} registered users</p>
      </div>
      <div className="bg-[#1c1c26] rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto] md:grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
          <span>Name</span>
          <span className="hidden md:block">User ID</span>
          <span>Joined</span>
          <span>Status</span>
        </div>
        {profiles.map((p: any) => (
          <div key={p.id} className="grid grid-cols-[1fr_1fr_auto] md:grid-cols-[1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#ec9f00]/15 flex items-center justify-center text-[10px] font-bold text-[#ec9f00]">
                {(p.display_name || 'U')[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-white truncate">{p.display_name || 'Anonymous'}</span>
            </div>
            <span className="hidden md:block text-[11px] text-gray-500 font-mono truncate">{p.user_id?.slice(0, 8)}...</span>
            <span className="text-[11px] text-gray-500">{format(new Date(p.created_at), 'MMM dd, yyyy')}</span>
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-center">Active</span>
          </div>
        ))}
        {profiles.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No users registered yet.</p>}
      </div>
    </div>
  );
};

/* ─── SETTINGS ─── */
const SettingsTab = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-extrabold text-white">Settings</h2>
      <p className="text-sm text-gray-500">Configure your Spark admin panel</p>
    </div>

    <div className="space-y-4">
      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Site Name</label>
            <input defaultValue="Spark by iBloov" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Contact Email</label>
            <input defaultValue="hello@spark.ibloov.com" className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none" />
          </div>
        </div>
      </div>

      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <h3 className="text-sm font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-3">
          {['New user registrations', 'Event sign-ups', 'Blog post comments', 'Weekly analytics digest'].map(item => (
            <label key={item} className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{item}</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[#ec9f00] rounded-full transition-transform" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-[#1c1c26] rounded-xl p-5 border border-red-500/10">
        <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-[12px] text-gray-500 mb-4">Irreversible actions that affect your entire Spark instance.</p>
        <button className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">Reset All Data</button>
      </div>
    </div>
  </div>
);

export default SparkAdmin;
