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
  Globe, MapPin, ArrowUpRight, ArrowDownRight, Search, Filter,
  Play, Link as LinkIcon, ExternalLink, Upload, Shield, UserCog
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

const DashboardTab = () => {
  const { data: eventsCount = 0 } = useQuery({ queryKey: ['admin-events-count'], queryFn: async () => { const { count } = await supabase.from('spark_events').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: postsCount = 0 } = useQuery({ queryKey: ['admin-posts-count'], queryFn: async () => { const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: usersCount = 0 } = useQuery({ queryKey: ['admin-users-count'], queryFn: async () => { const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }); return count || 0; } });

  // Real enrollment data
  const { data: enrollments = [] } = useQuery({
    queryKey: ['admin-all-enrollments'],
    queryFn: async () => {
      const { data } = await supabase.from('program_enrollments').select('*, spark_programs(cool_name)');
      return data || [];
    },
  });

  const { data: allPrograms = [] } = useQuery({
    queryKey: ['admin-all-programs'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_programs').select('id, cool_name, color');
      return data || [];
    },
  });

  const { data: allModules = [] } = useQuery({
    queryKey: ['admin-all-modules'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_program_modules').select('id, program_id');
      return data || [];
    },
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ['admin-all-lessons'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_program_lessons').select('id, module_id');
      return data || [];
    },
  });

  const { data: allProgress = [] } = useQuery({
    queryKey: ['admin-all-progress'],
    queryFn: async () => {
      const { data } = await supabase.from('lesson_progress').select('user_id, lesson_id, completed').eq('completed', true);
      return data || [];
    },
  });

  // Build real enrollment chart data
  const enrollmentChartData = allPrograms.map((p: any) => {
    const count = enrollments.filter((e: any) => e.program_id === p.id).length;
    const mods = allModules.filter((m: any) => m.program_id === p.id);
    const modIds = mods.map((m: any) => m.id);
    const programLessons = allLessons.filter((l: any) => modIds.includes(l.module_id));
    const totalLessons = programLessons.length;
    
    // Calculate avg completion rate
    const enrolledUserIds = [...new Set(enrollments.filter((e: any) => e.program_id === p.id).map((e: any) => e.user_id))];
    let avgCompletion = 0;
    if (enrolledUserIds.length > 0 && totalLessons > 0) {
      const lessonIds = programLessons.map((l: any) => l.id);
      const totalCompleted = enrolledUserIds.reduce((acc: number, uid: string) => {
        const userCompleted = allProgress.filter((pr: any) => pr.user_id === uid && lessonIds.includes(pr.lesson_id)).length;
        return acc + userCompleted;
      }, 0);
      avgCompletion = Math.round((totalCompleted / (enrolledUserIds.length * totalLessons)) * 100);
    }
    
    return { name: p.cool_name?.replace('The ', ''), enrolled: count, completion: avgCompletion, color: p.color };
  });

  const totalEnrollments = enrollments.length;

  const stats = [
    { label: 'Total Learners', value: usersCount, change: '+18%', up: true, icon: Users, color: '#ec9f00' },
    { label: 'Enrollments', value: totalEnrollments, change: `${allPrograms.length} programs`, up: true, icon: BookOpen, color: '#00C896' },
    { label: 'Active Events', value: eventsCount, change: '+12%', up: true, icon: Calendar, color: '#7B61FF' },
    { label: 'Blog Posts', value: postsCount, change: '+24%', up: true, icon: FileText, color: '#FF6B35' },
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
              <div className="flex items-center gap-0.5 text-[11px] font-bold text-emerald-400">
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

      {/* Program enrollments bar chart - REAL DATA */}
      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Program Enrollments</h3>
            <p className="text-[11px] text-gray-500">Real enrollment data per program</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">LIVE DATA</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={enrollmentChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1c1c26', border: '1px solid #ffffff10', borderRadius: 8, fontSize: 12, color: '#fff' }} />
            <Bar dataKey="enrolled" fill="#ec9f00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion Rates Table */}
      <div className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Completion Rates</h3>
            <p className="text-[11px] text-gray-500">Average learner progress per program</p>
          </div>
        </div>
        <div className="space-y-3">
          {enrollmentChartData.map((p: any) => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-400 w-24 truncate">{p.name}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${p.completion}%`, backgroundColor: p.color || '#ec9f00' }} />
              </div>
              <span className="text-xs font-extrabold text-white w-12 text-right">{p.completion}%</span>
              <span className="text-[10px] text-gray-500 w-20 text-right">{p.enrolled} enrolled</span>
            </div>
          ))}
        </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e: any) => (
          <div key={e.id} className="group bg-[#1c1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-[#ec9f00]/30 hover:shadow-2xl hover:shadow-[#ec9f00]/5 transition-all">
            <div className="relative h-40 overflow-hidden bg-white/5">
              {e.cover_image_url ? (
                <img src={e.cover_image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#ec9f00]/20 to-[#7B61FF]/10 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-[#ec9f00]/40" />
                </div>
              )}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">{e.event_type}</span>
                {e.is_virtual && <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full bg-[#ec9f00] text-gray-900">Virtual</span>}
              </div>
              <button onClick={() => togglePublish.mutate({ id: e.id, published: e.published })} title={e.published ? 'Published' : 'Draft'} className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-bold flex items-center gap-1 backdrop-blur-sm ${e.published ? 'bg-emerald-500/90 text-white' : 'bg-gray-700/90 text-gray-300'}`}>
                {e.published ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
              </button>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-[#ec9f00] font-bold mb-1">{e.date ? format(new Date(e.date), 'MMM dd, yyyy · h:mm a') : 'No date'}</p>
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{e.title}</h3>
              {e.location && <p className="text-[11px] text-gray-500 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" /> {e.location}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <Link to={`/spark/events/${e.id}`} target="_blank" className="text-[10px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#d48e00] flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </Link>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(e)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => { if (confirm('Delete this event?')) deleteMutation.mutate(e.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="col-span-full text-center text-gray-600 py-12 text-sm">No events found.</p>}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p: any) => (
          <article key={p.id} className="group bg-[#1c1c26] rounded-2xl overflow-hidden border border-white/5 hover:border-[#ec9f00]/30 hover:shadow-2xl hover:shadow-[#ec9f00]/5 transition-all">
            <div className="relative h-40 overflow-hidden bg-white/5">
              {p.cover_image_url ? (
                <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#FF6B35]/20 to-[#ec9f00]/10 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-[#ec9f00]/40" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-sm">{p.category}</span>
              </div>
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] tracking-[0.15em] uppercase font-bold flex items-center gap-1 backdrop-blur-sm ${p.published ? 'bg-emerald-500/90 text-white' : 'bg-gray-700/90 text-gray-300'}`}>
                {p.published ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{p.title}</h3>
              {p.excerpt && <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{p.excerpt}</p>}
              <p className="text-[10px] text-gray-500 mb-3">By {p.author_name}{p.published_at ? ` · ${format(new Date(p.published_at), 'MMM dd, yyyy')}` : ''}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <Link to={`/spark/news/${p.slug}`} target="_blank" className="text-[10px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#d48e00] flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </Link>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(p.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="col-span-full text-center text-gray-600 py-12 text-sm">No posts found.</p>}
      </div>
    </div>
  );
};

/* ─── PROGRAMS (Full CRUD from DB) ─── */
const ProgramsTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [curriculumProgramId, setCurriculumProgramId] = useState<string | null>(null);
  const [form, setForm] = useState({ cool_name: '', real_name: '', tag: 'CORE', description: '', duration: '', lessons: 0, color: '#ec9f00', image_url: '', youtube_url: '', sort_order: 0, status: 'active', published: true });

  const { data: programs = [] } = useQuery({
    queryKey: ['admin-spark-programs'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_programs').select('*').order('sort_order', { ascending: true });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, lessons: Number(form.lessons), sort_order: Number(form.sort_order) };
      if (editingProgram) {
        const { error } = await supabase.from('spark_programs').update(payload).eq('id', editingProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spark_programs').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-programs'] }); setShowForm(false); setEditingProgram(null); resetForm(); toast.success('Program saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_programs').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-programs'] }); toast.success('Program deleted'); },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from('spark_programs').update({ published: !published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-programs'] }); toast.success('Status updated'); },
  });

  const resetForm = () => setForm({ cool_name: '', real_name: '', tag: 'CORE', description: '', duration: '', lessons: 0, color: '#ec9f00', image_url: '', youtube_url: '', sort_order: 0, status: 'active', published: true });

  const openEdit = (p: any) => {
    setEditingProgram(p);
    setForm({ cool_name: p.cool_name, real_name: p.real_name, tag: p.tag, description: p.description || '', duration: p.duration || '', lessons: p.lessons || 0, color: p.color, image_url: p.image_url || '', youtube_url: p.youtube_url || '', sort_order: p.sort_order, status: p.status, published: p.published });
    setShowForm(true);
  };

  const filtered = programs.filter((p: any) => p.cool_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.real_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const inputCls = "px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none w-full";

  if (curriculumProgramId) {
    const prog = programs.find((p: any) => p.id === curriculumProgramId);
    return <CurriculumManager programId={curriculumProgramId} programName={prog?.cool_name || 'Program'} programColor={prog?.color || '#ec9f00'} onBack={() => setCurriculumProgramId(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Programs</h2>
          <p className="text-sm text-gray-500">{programs.length} micro-credential programs</p>
        </div>
        <button onClick={() => { resetForm(); setEditingProgram(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors">
          <Plus className="w-4 h-4" /> New Program
        </button>
      </div>

      <div className="flex items-center gap-2 bg-[#1c1c26] rounded-lg px-3 py-2 border border-white/5">
        <Search className="w-4 h-4 text-gray-500" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search programs..." className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-600" />
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">{editingProgram ? 'Edit Program' : 'Create Program'}</h3>
            <button onClick={() => { setShowForm(false); setEditingProgram(null); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Cool Name</label>
              <input placeholder="e.g. The Architect" value={form.cool_name} onChange={e => setForm({ ...form, cool_name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Real Name</label>
              <input placeholder="e.g. Advanced Event Planning" value={form.real_name} onChange={e => setForm({ ...form, real_name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Tag</label>
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className={inputCls}>
                <option value="FLAGSHIP">Flagship</option><option value="CORE">Core</option><option value="ESSENTIAL">Essential</option>
                <option value="SIGNATURE">Signature</option><option value="TRENDING">Trending</option><option value="CREATIVE">Creative</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Duration</label>
              <input placeholder="e.g. 12 weeks" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Lessons</label>
              <input type="number" value={form.lessons} onChange={e => setForm({ ...form, lessons: parseInt(e.target.value) || 0 })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Cover Image URL</label>
              <input placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                <span className="flex items-center gap-1.5"><Play className="w-3 h-3" /> About Video URL (YouTube)</span>
              </label>
              <input placeholder="https://youtube.com/..." value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>
                <option value="active">Active</option><option value="coming_soon">Coming Soon</option><option value="draft">Draft</option><option value="archived">Archived</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Description</label>
              <textarea placeholder="Program description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputCls} rows={3} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded accent-[#ec9f00]" /> Published</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.cool_name || !form.real_name} className="bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">
              {editingProgram ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingProgram(null); }} className="text-gray-500 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-white">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-1.5">
        {filtered.map((p: any, i: number) => (
          <div key={p.id} className="bg-[#1c1c26] rounded-xl px-4 py-4 border border-white/5 flex items-center justify-between gap-4 hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-[11px] text-gray-600 font-mono w-5 flex-shrink-0">0{i + 1}</span>
              <button onClick={() => togglePublish.mutate({ id: p.id, published: p.published })} className="flex-shrink-0">
                {p.published ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
              </button>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{p.cool_name}</p>
                <p className="text-[11px] text-gray-500 truncate">{p.real_name} · {p.duration} · {p.lessons} lessons</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={() => setCurriculumProgramId(p.id)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-bold text-[#7B61FF] hover:text-[#9B81FF] transition-colors">
                <BookOpen className="w-3.5 h-3.5" /> Curriculum
              </button>
              {p.youtube_url && (
                <a href={p.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-bold text-[#ec9f00] hover:text-[#f0b840] transition-colors">
                  <Play className="w-3.5 h-3.5" /> About
                </a>
              )}
              <span className={`text-[9px] uppercase tracking-[0.1em] font-bold px-2.5 py-1 rounded-full ${p.status === 'active' ? 'text-emerald-400 bg-emerald-400/10' : p.status === 'coming_soon' ? 'text-orange-400 bg-orange-400/10' : p.status === 'draft' ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                {p.status === 'coming_soon' ? 'Coming Soon' : p.status}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => { if (confirm('Delete this program?')) deleteMutation.mutate(p.id); }} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No programs found.</p>}
      </div>
    </div>
  );
};

/* ─── CURRICULUM MANAGER ─── */
const CurriculumManager = ({ programId, programName, programColor, onBack }: { programId: string; programName: string; programColor: string; onBack: () => void }) => {
  const queryClient = useQueryClient();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', sort_order: 0 });
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', duration_minutes: 0, lesson_type: 'video', content_url: '', sort_order: 0, is_free_preview: false });
  const [showQuizForm, setShowQuizForm] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({ title: 'Module Quiz', passing_score: 70, max_attempts: 3 });
  const [showQuestionForm, setShowQuestionForm] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({ question_text: '', options: ['', '', '', ''], correct_answer_index: 0, sort_order: 0 });
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const { data: modules = [] } = useQuery({
    queryKey: ['admin-modules', programId],
    queryFn: async () => {
      const { data } = await supabase.from('spark_program_modules').select('*').eq('program_id', programId).order('sort_order', { ascending: true });
      return data || [];
    },
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['admin-lessons', programId],
    queryFn: async () => {
      const moduleIds = modules.map((m: any) => m.id);
      if (moduleIds.length === 0) return [];
      const { data } = await supabase.from('spark_program_lessons').select('*').in('module_id', moduleIds).order('sort_order', { ascending: true });
      return data || [];
    },
    enabled: modules.length > 0,
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ['admin-quizzes', programId],
    queryFn: async () => {
      const moduleIds = modules.map((m: any) => m.id);
      if (moduleIds.length === 0) return [];
      const { data } = await supabase.from('module_quizzes').select('*').in('module_id', moduleIds);
      return data || [];
    },
    enabled: modules.length > 0,
  });

  const { data: allQuestions = [] } = useQuery({
    queryKey: ['admin-quiz-questions', programId],
    queryFn: async () => {
      const quizIds = quizzes.map((q: any) => q.id);
      if (quizIds.length === 0) return [];
      const { data } = await supabase.from('quiz_questions').select('*').in('quiz_id', quizIds).order('sort_order');
      return data || [];
    },
    enabled: quizzes.length > 0,
  });

  const getLessonsForModule = (moduleId: string) => lessons.filter((l: any) => l.module_id === moduleId);
  const getQuizForModule = (moduleId: string) => quizzes.find((q: any) => q.module_id === moduleId);
  const getQuestionsForQuiz = (quizId: string) => allQuestions.filter((q: any) => q.quiz_id === quizId);

  const saveModuleMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...moduleForm, sort_order: Number(moduleForm.sort_order), program_id: programId };
      if (editingModule) {
        const { error } = await supabase.from('spark_program_modules').update({ title: payload.title, description: payload.description, sort_order: payload.sort_order }).eq('id', editingModule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spark_program_modules').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-modules', programId] }); setShowModuleForm(false); setEditingModule(null); setModuleForm({ title: '', description: '', sort_order: 0 }); toast.success('Module saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteModuleMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_program_modules').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-modules', programId] }); queryClient.invalidateQueries({ queryKey: ['admin-lessons', programId] }); queryClient.invalidateQueries({ queryKey: ['admin-quizzes', programId] }); toast.success('Module deleted'); },
  });

  const saveLessonMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const payload = { ...lessonForm, duration_minutes: Number(lessonForm.duration_minutes), sort_order: Number(lessonForm.sort_order), module_id: moduleId };
      if (editingLesson) {
        const { error } = await supabase.from('spark_program_lessons').update({ title: payload.title, description: payload.description, duration_minutes: payload.duration_minutes, lesson_type: payload.lesson_type, content_url: payload.content_url, sort_order: payload.sort_order, is_free_preview: payload.is_free_preview }).eq('id', editingLesson.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spark_program_lessons').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', programId] }); setShowLessonForm(null); setEditingLesson(null); setLessonForm({ title: '', description: '', duration_minutes: 0, lesson_type: 'video', content_url: '', sort_order: 0, is_free_preview: false }); toast.success('Lesson saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteLessonMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_program_lessons').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-lessons', programId] }); toast.success('Lesson deleted'); },
  });

  const saveQuizMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      const existing = getQuizForModule(moduleId);
      if (existing) {
        const { error } = await supabase.from('module_quizzes').update({ title: quizForm.title, passing_score: quizForm.passing_score, max_attempts: quizForm.max_attempts }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('module_quizzes').insert({ module_id: moduleId, ...quizForm });
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quizzes', programId] }); setShowQuizForm(null); toast.success('Quiz saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteQuizMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('module_quizzes').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quizzes', programId] }); queryClient.invalidateQueries({ queryKey: ['admin-quiz-questions', programId] }); toast.success('Quiz deleted'); },
  });

  const saveQuestionMutation = useMutation({
    mutationFn: async (quizId: string) => {
      const payload = { quiz_id: quizId, question_text: questionForm.question_text, options: questionForm.options.filter(o => o.trim()), correct_answer_index: questionForm.correct_answer_index, sort_order: questionForm.sort_order };
      if (editingQuestion) {
        const { error } = await supabase.from('quiz_questions').update(payload).eq('id', editingQuestion.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('quiz_questions').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quiz-questions', programId] }); setShowQuestionForm(null); setEditingQuestion(null); setQuestionForm({ question_text: '', options: ['', '', '', ''], correct_answer_index: 0, sort_order: 0 }); toast.success('Question saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('quiz_questions').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-quiz-questions', programId] }); toast.success('Question deleted'); },
  });

  const inputCls = "px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none w-full";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors text-sm font-bold">← Back</button>
        <div>
          <h2 className="text-xl font-extrabold text-white">Curriculum: {programName}</h2>
          <p className="text-sm text-gray-500">{modules.length} modules · {lessons.length} lessons · {quizzes.length} quizzes</p>
        </div>
      </div>

      <button onClick={() => { setModuleForm({ title: '', description: '', sort_order: modules.length }); setEditingModule(null); setShowModuleForm(true); }}
        className="flex items-center gap-2 bg-[#7B61FF] text-white text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#6B51EF] transition-colors">
        <Plus className="w-4 h-4" /> Add Module
      </button>

      {showModuleForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">{editingModule ? 'Edit Module' : 'Add Module'}</h3>
            <button onClick={() => { setShowModuleForm(false); setEditingModule(null); }} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Module Title</label>
              <input placeholder="e.g. Introduction to Event Planning" value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Description</label>
              <textarea placeholder="Module overview..." value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })} className={inputCls} rows={2} />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Sort Order</label>
              <input type="number" value={moduleForm.sort_order} onChange={e => setModuleForm({ ...moduleForm, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveModuleMutation.mutate()} disabled={!moduleForm.title} className="bg-[#7B61FF] text-white text-[11px] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 rounded-lg hover:bg-[#6B51EF] transition-colors disabled:opacity-50">
              {editingModule ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowModuleForm(false); setEditingModule(null); }} className="text-gray-500 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-white">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {modules.map((mod: any, idx: number) => {
          const modLessons = getLessonsForModule(mod.id);
          const quiz = getQuizForModule(mod.id);
          const quizQuestions = quiz ? getQuestionsForQuiz(quiz.id) : [];
          return (
            <div key={mod.id} className="bg-[#1c1c26] rounded-xl border border-white/5 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold text-white" style={{ backgroundColor: programColor }}>
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{mod.title}</p>
                    <p className="text-[11px] text-gray-500">{modLessons.length} lessons{quiz ? ` · Quiz (${quizQuestions.length} questions)` : ''}{mod.description ? ` · ${mod.description.substring(0, 50)}...` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setShowLessonForm(mod.id); setEditingLesson(null); setLessonForm({ title: '', description: '', duration_minutes: 0, lesson_type: 'video', content_url: '', sort_order: modLessons.length, is_free_preview: false }); }}
                    className="text-[10px] uppercase tracking-[0.1em] font-bold px-3 py-1.5 rounded-lg bg-[#ec9f00]/10 text-[#ec9f00] hover:bg-[#ec9f00]/20 transition-colors">
                    + Lesson
                  </button>
                  {!quiz && (
                    <button onClick={() => { setQuizForm({ title: 'Module Quiz', passing_score: 70, max_attempts: 3 }); setShowQuizForm(mod.id); }}
                      className="text-[10px] uppercase tracking-[0.1em] font-bold px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors">
                      + Quiz
                    </button>
                  )}
                  <button onClick={() => { setEditingModule(mod); setModuleForm({ title: mod.title, description: mod.description || '', sort_order: mod.sort_order }); setShowModuleForm(true); }}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                  <button onClick={() => { if (confirm('Delete this module and all its lessons?')) deleteModuleMutation.mutate(mod.id); }}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>

              {showLessonForm === mod.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-b border-white/5 bg-white/[0.02]">
                  <h4 className="text-xs font-bold text-white mb-3">{editingLesson ? 'Edit Lesson' : 'Add Lesson'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Title</label>
                      <input placeholder="Lesson title" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Type</label>
                      <select value={lessonForm.lesson_type} onChange={e => setLessonForm({ ...lessonForm, lesson_type: e.target.value })} className={inputCls}>
                        <option value="video">Video</option><option value="reading">Reading</option><option value="quiz">Quiz</option><option value="exercise">Exercise</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Description</label>
                      <input placeholder="Brief description" value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Duration (min)</label>
                      <input type="number" value={lessonForm.duration_minutes} onChange={e => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 0 })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Content URL</label>
                      <input placeholder="https://..." value={lessonForm.content_url} onChange={e => setLessonForm({ ...lessonForm, content_url: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Order</label>
                      <input type="number" value={lessonForm.sort_order} onChange={e => setLessonForm({ ...lessonForm, sort_order: parseInt(e.target.value) || 0 })} className={inputCls} />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={lessonForm.is_free_preview} onChange={e => setLessonForm({ ...lessonForm, is_free_preview: e.target.checked })} className="rounded accent-[#ec9f00]" /> Free Preview</label>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => saveLessonMutation.mutate(mod.id)} disabled={!lessonForm.title} className="bg-[#ec9f00] text-gray-900 text-[10px] font-extrabold tracking-[0.08em] uppercase px-5 py-2 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">
                      {editingLesson ? 'Update' : 'Add'}
                    </button>
                    <button onClick={() => { setShowLessonForm(null); setEditingLesson(null); }} className="text-gray-500 text-[10px] font-bold uppercase px-3 py-2 hover:text-white">Cancel</button>
                  </div>
                </motion.div>
              )}

              {modLessons.length > 0 && (
                <div>
                  {modLessons.map((lesson: any, lIdx: number) => (
                    <div key={lesson.id} className={`flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors ${lIdx < modLessons.length - 1 ? 'border-b border-white/[0.03]' : ''}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-gray-600 font-mono w-4">{lIdx + 1}</span>
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${lesson.lesson_type === 'video' ? 'text-blue-400 bg-blue-400/10' : lesson.lesson_type === 'quiz' ? 'text-emerald-400 bg-emerald-400/10' : lesson.lesson_type === 'exercise' ? 'text-orange-400 bg-orange-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                          {lesson.lesson_type}
                        </span>
                        <p className="text-sm text-white/80 truncate">{lesson.title}</p>
                        {lesson.is_free_preview && <span className="text-[8px] uppercase font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">Preview</span>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {lesson.duration_minutes > 0 && <span className="text-[10px] text-gray-500">{lesson.duration_minutes}m</span>}
                        <button onClick={() => { setEditingLesson(lesson); setLessonForm({ title: lesson.title, description: lesson.description || '', duration_minutes: lesson.duration_minutes || 0, lesson_type: lesson.lesson_type, content_url: lesson.content_url || '', sort_order: lesson.sort_order, is_free_preview: lesson.is_free_preview }); setShowLessonForm(mod.id); }}
                          className="p-1.5 hover:bg-white/5 rounded transition-colors"><Pencil className="w-3 h-3 text-gray-500" /></button>
                        <button onClick={() => { if (confirm('Delete this lesson?')) deleteLessonMutation.mutate(lesson.id); }}
                          className="p-1.5 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {modLessons.length === 0 && !showLessonForm && (
                <p className="text-center text-gray-600 py-6 text-xs">No lessons yet. Click "+ Lesson" to add one.</p>
              )}

              {/* Quiz Section */}
              {quiz && (
                <div className="border-t border-white/5">
                  <div className="flex items-center justify-between px-4 py-3 bg-emerald-400/5">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">Quiz</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{quiz.title}</p>
                        <p className="text-[10px] text-gray-500">Pass: {quiz.passing_score}% · Max attempts: {quiz.max_attempts} · {quizQuestions.length} questions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setShowQuestionForm(quiz.id); setEditingQuestion(null); setQuestionForm({ question_text: '', options: ['', '', '', ''], correct_answer_index: 0, sort_order: quizQuestions.length }); }}
                        className="text-[10px] uppercase tracking-[0.1em] font-bold px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors">
                        + Question
                      </button>
                      <button onClick={() => { setQuizForm({ title: quiz.title, passing_score: quiz.passing_score, max_attempts: quiz.max_attempts }); setShowQuizForm(mod.id); }}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                      <button onClick={() => { if (confirm('Delete this quiz and all questions?')) deleteQuizMutation.mutate(quiz.id); }}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </div>

                  {showQuestionForm === quiz.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-t border-white/[0.03] bg-white/[0.02]">
                      <h4 className="text-xs font-bold text-white mb-3">{editingQuestion ? 'Edit Question' : 'Add Question'}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Question</label>
                          <textarea placeholder="Enter the question..." value={questionForm.question_text} onChange={e => setQuestionForm({ ...questionForm, question_text: e.target.value })} className={inputCls} rows={2} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {questionForm.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <button onClick={() => setQuestionForm({ ...questionForm, correct_answer_index: i })}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold ${questionForm.correct_answer_index === i ? 'border-emerald-400 bg-emerald-400 text-white' : 'border-gray-600 text-gray-500'}`}>
                                {String.fromCharCode(65 + i)}
                              </button>
                              <input placeholder={`Option ${String.fromCharCode(65 + i)}`} value={opt} onChange={e => { const newOpts = [...questionForm.options]; newOpts[i] = e.target.value; setQuestionForm({ ...questionForm, options: newOpts }); }} className={inputCls} />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-500">Click the letter circle to mark the correct answer (currently: <span className="text-emerald-400 font-bold">{String.fromCharCode(65 + questionForm.correct_answer_index)}</span>)</p>
                        <div className="flex gap-3">
                          <button onClick={() => saveQuestionMutation.mutate(quiz.id)} disabled={!questionForm.question_text || questionForm.options.filter(o => o.trim()).length < 2}
                            className="bg-emerald-500 text-white text-[10px] font-extrabold tracking-[0.08em] uppercase px-5 py-2 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50">
                            {editingQuestion ? 'Update' : 'Add Question'}
                          </button>
                          <button onClick={() => { setShowQuestionForm(null); setEditingQuestion(null); }} className="text-gray-500 text-[10px] font-bold uppercase px-3 py-2 hover:text-white">Cancel</button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {quizQuestions.map((q: any, qIdx: number) => (
                    <div key={q.id} className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.03] hover:bg-white/[0.02]">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[10px] text-gray-600 font-mono w-4">Q{qIdx + 1}</span>
                        <p className="text-xs text-white/70 truncate">{q.question_text}</p>
                        <span className="text-[9px] text-emerald-400 font-bold flex-shrink-0">{(q.options as string[])?.[q.correct_answer_index] ? `✓ ${String.fromCharCode(65 + q.correct_answer_index)}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => { setEditingQuestion(q); setQuestionForm({ question_text: q.question_text, options: [...(q.options as string[]), '', '', '', ''].slice(0, 4), correct_answer_index: q.correct_answer_index, sort_order: q.sort_order }); setShowQuestionForm(quiz.id); }}
                          className="p-1.5 hover:bg-white/5 rounded transition-colors"><Pencil className="w-3 h-3 text-gray-500" /></button>
                        <button onClick={() => { if (confirm('Delete?')) deleteQuestionMutation.mutate(q.id); }}
                          className="p-1.5 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz create form */}
              {showQuizForm === mod.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border-t border-white/5 bg-emerald-400/5">
                  <h4 className="text-xs font-bold text-white mb-3">{quiz ? 'Edit Quiz Settings' : 'Create Module Quiz'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Quiz Title</label>
                      <input value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Passing Score (%)</label>
                      <input type="number" min={0} max={100} value={quizForm.passing_score} onChange={e => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) || 70 })} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Max Attempts</label>
                      <input type="number" min={1} max={10} value={quizForm.max_attempts} onChange={e => setQuizForm({ ...quizForm, max_attempts: parseInt(e.target.value) || 3 })} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => saveQuizMutation.mutate(mod.id)} className="bg-emerald-500 text-white text-[10px] font-extrabold tracking-[0.08em] uppercase px-5 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      {quiz ? 'Update Quiz' : 'Create Quiz'}
                    </button>
                    <button onClick={() => setShowQuizForm(null)} className="text-gray-500 text-[10px] font-bold uppercase px-3 py-2 hover:text-white">Cancel</button>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
        {modules.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No modules yet. Add a module to start building the curriculum.</p>}
      </div>
    </div>
  );
};

/* ─── MEDIA (Full CRUD with DB) ─── */
const MediaTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', file_url: '', file_type: 'image' });

  const { data: media = [] } = useQuery({
    queryKey: ['admin-spark-media'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_media').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('spark_media').insert(form);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-media'] }); setShowForm(false); setForm({ title: '', file_url: '', file_type: 'image' }); toast.success('Media added!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_media').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-media'] }); toast.success('Media deleted'); },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const path = `media/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('event-images').upload(path, file);
    if (error) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('event-images').getPublicUrl(path);
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
    await supabase.from('spark_media').insert({ title: file.name, file_url: publicUrl, file_type: fileType, file_size: file.size });
    queryClient.invalidateQueries({ queryKey: ['admin-spark-media'] });
    toast.success('File uploaded!');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Media Gallery</h2>
          <p className="text-sm text-gray-500">{media.length} files</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-white/5 text-white text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
            <LinkIcon className="w-4 h-4" /> Add URL
          </button>
          <label className="flex items-center gap-2 bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-4 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors cursor-pointer">
            <Upload className="w-4 h-4" /> Upload
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1c1c26] rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white">Add Media from URL</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input placeholder="Title (optional)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <input placeholder="File URL" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:border-[#ec9f00]/50 outline-none" />
            <select value={form.file_type} onChange={e => setForm({ ...form, file_type: e.target.value })} className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none">
              <option value="image">Image</option><option value="video">Video</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.file_url} className="bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-6 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">Add</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-white">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {media.map((m: any) => (
          <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[#1c1c26] border border-white/5 hover:border-[#ec9f00]/30 transition-colors cursor-pointer">
            {m.file_type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-[#1c1c26]">
                <Play className="w-10 h-10 text-gray-500" />
              </div>
            ) : (
              <img src={m.file_url} alt={m.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30"><ExternalLink className="w-4 h-4 text-white" /></a>
                  <button onClick={() => { if (confirm('Delete this file?')) deleteMutation.mutate(m.id); }} className="p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-red-500/50"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
                {m.title && <p className="text-[10px] text-white/80 font-semibold mt-1 truncate max-w-[90%]">{m.title}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <label className="block bg-[#1c1c26] rounded-xl p-8 border border-white/5 border-dashed text-center cursor-pointer hover:border-[#ec9f00]/30 transition-colors">
          <Image className="w-10 h-10 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Drop files here or click to upload</p>
          <p className="text-[11px] text-gray-600">JPG, PNG, MP4 up to 50MB</p>
          <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
        </label>
      )}
    </div>
  );
};

/* ─── USERS (with role management) ─── */
const UsersTab = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ['admin-all-enrollments'],
    queryFn: async () => {
      const { data } = await supabase.from('program_enrollments').select('user_id, program_id');
      return data || [];
    },
  });

  const enrollmentCount = (userId: string) => enrollments.filter((e: any) => e.user_id === userId).length;

  const filtered = profiles.filter((p: any) => {
    const q = searchQuery.toLowerCase();
    return (p.display_name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-white">Users</h2>
        <p className="text-sm text-gray-500">{profiles.length} registered users</p>
      </div>

      <div className="flex items-center gap-2 bg-[#1c1c26] rounded-lg px-3 py-2 border border-white/5">
        <Search className="w-4 h-4 text-gray-500" />
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-600" />
      </div>

      <div className="bg-[#1c1c26] rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1.3fr_1.5fr_1fr_auto_auto] gap-4 px-4 py-3 border-b border-white/5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
          <span>Name</span>
          <span>Email</span>
          <span>Joined</span>
          <span className="text-center">Courses</span>
          <span>Actions</span>
        </div>
        {filtered.map((p: any) => {
          const courses = enrollmentCount(p.user_id);
          return (
            <div key={p.id} className="grid grid-cols-[1.3fr_1.5fr_1fr_auto_auto] gap-4 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#ec9f00]/15 flex items-center justify-center text-[10px] font-bold text-[#ec9f00]">
                  {(p.display_name || 'U')[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-white truncate">{p.display_name || 'Anonymous'}</span>
              </div>
              <span className="text-[11px] text-gray-400 truncate">{p.email || '—'}</span>
              <span className="text-[11px] text-gray-500">{format(new Date(p.created_at), 'MMM dd, yyyy')}</span>
              <span className="text-center text-sm font-bold text-white">{courses}</span>
              <Link to={`/spark/admin/users/${p.user_id}`}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-bold px-3 py-1.5 rounded-lg text-[#ec9f00] hover:bg-[#ec9f00]/10 transition-colors">
                <Eye className="w-3 h-3" /> View
              </Link>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-gray-600 py-12 text-sm">No users found.</p>}
      </div>
    </div>
  );
};

/* ─── SETTINGS ─── */
type Role = 'admin' | 'moderator' | 'user';

const SettingsTab = () => {
  const queryClient = useQueryClient();
  const [section, setSection] = useState<'profile' | 'security' | 'roles' | 'general' | 'notifications' | 'danger'>('profile');
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const sections: { id: typeof section; label: string; icon: any; desc: string }[] = [
    { id: 'profile', label: 'My Profile', icon: UserCog, desc: 'Display name & email' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Password & sessions' },
    { id: 'roles', label: 'Roles & Permissions', icon: Users, desc: 'Manage admins & moderators' },
    { id: 'general', label: 'General', icon: Settings, desc: 'Site preferences' },
    { id: 'notifications', label: 'Notifications', icon: TrendingUp, desc: 'Alert preferences' },
    { id: 'danger', label: 'Danger Zone', icon: Trash2, desc: 'Irreversible actions' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account, team and site configuration</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
        {/* Side nav */}
        <div className="bg-[#1c1c26] rounded-xl border border-white/5 p-2 h-fit">
          {sections.map(s => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${active ? 'bg-[#ec9f00]/10 text-[#ec9f00]' : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'}`}>
                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[12px] font-bold">{s.label}</div>
                  <div className="text-[10px] text-gray-500 truncate">{s.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {section === 'profile' && <ProfileSection user={user} />}
          {section === 'security' && <SecuritySection user={user} />}
          {section === 'roles' && <RolesSection currentUserId={user?.id} />}
          {section === 'general' && <GeneralSection />}
          {section === 'notifications' && <NotificationsSection />}
          {section === 'danger' && <DangerSection />}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; desc?: string; children: React.ReactNode; tone?: 'default' | 'danger' }> = ({ title, desc, children, tone }) => (
  <div className={`bg-[#1c1c26] rounded-xl p-5 border ${tone === 'danger' ? 'border-red-500/20' : 'border-white/5'}`}>
    <h3 className={`text-sm font-bold mb-1 ${tone === 'danger' ? 'text-red-400' : 'text-white'}`}>{title}</h3>
    {desc && <p className="text-[12px] text-gray-500 mb-4">{desc}</p>}
    {!desc && <div className="mb-4" />}
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:border-[#ec9f00]/50 outline-none";
const btnPrimary = "bg-[#ec9f00] text-gray-900 text-[11px] font-extrabold tracking-[0.08em] uppercase px-5 py-2.5 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50";

/* Profile */
const ProfileSection = ({ user }: { user: any }) => {
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!user) return;
    setEmail(user.email || '');
    supabase.from('profiles').select('display_name').eq('user_id', user.id).maybeSingle().then(({ data }) => {
      setDisplayName(data?.display_name || '');
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error: pErr } = await supabase.from('profiles').upsert({ user_id: user.id, display_name: displayName }, { onConflict: 'user_id' });
      if (pErr) throw pErr;
      if (email && email !== user.email) {
        const { error: eErr } = await supabase.auth.updateUser({ email });
        if (eErr) throw eErr;
        toast.success('Profile saved. Check your inbox to confirm new email.');
      } else {
        toast.success('Profile saved');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-profiles'] });
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <Card title="My Profile" desc="Update how your name and email appear across the admin.">
        <div className="space-y-4">
          <Field label="Display Name">
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputCls} placeholder="Your name" />
          </Field>
          <Field label="Email">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <button onClick={saveProfile} disabled={saving} className={btnPrimary}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </Card>

      <Card title="Account">
        <div className="grid sm:grid-cols-2 gap-3 text-[12px]">
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">User ID</div>
            <div className="text-gray-300 font-mono text-[11px] truncate">{user?.id || '—'}</div>
          </div>
          <div className="bg-white/[0.03] rounded-lg px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Last sign-in</div>
            <div className="text-gray-300">{user?.last_sign_in_at ? format(new Date(user.last_sign_in_at), 'MMM dd, yyyy HH:mm') : '—'}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* Security */
const SecuritySection = ({ user }: { user: any }) => {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [busy, setBusy] = useState(false);

  React.useEffect(() => { setResetEmail(user?.email || ''); }, [user]);

  const changePassword = async () => {
    if (pwd.length < 8) return toast.error('Password must be at least 8 characters');
    if (pwd !== confirm) return toast.error('Passwords do not match');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setBusy(false);
    if (error) return toast.error(error.message);
    setPwd(''); setConfirm('');
    toast.success('Password updated');
  };

  const sendReset = async () => {
    if (!resetEmail) return toast.error('Email required');
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/spark/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success('Reset link sent to ' + resetEmail);
  };

  const signOutAll = async () => {
    await supabase.auth.signOut({ scope: 'global' });
    toast.success('Signed out of all sessions');
    window.location.href = '/spark/auth';
  };

  return (
    <div className="space-y-4">
      <Card title="Change Password" desc="Use at least 8 characters with a mix of letters and numbers.">
        <div className="space-y-3">
          <Field label="New Password">
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Confirm Password">
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} />
          </Field>
          <button onClick={changePassword} disabled={busy} className={btnPrimary}>Update Password</button>
        </div>
      </Card>

      <Card title="Send Password Reset" desc="Email a reset link to any account email (yours or another admin's).">
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} className={inputCls} placeholder="email@example.com" />
          <button onClick={sendReset} disabled={busy} className={btnPrimary + ' whitespace-nowrap'}>Send Link</button>
        </div>
      </Card>

      <Card title="Active Sessions">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-gray-300">Sign out from every device</p>
            <p className="text-[11px] text-gray-500">Useful if you suspect unauthorized access.</p>
          </div>
          <button onClick={signOutAll} className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5">
            <LogOut className="w-3 h-3 inline mr-1.5" /> Sign Out All
          </button>
        </div>
      </Card>
    </div>
  );
};

/* Roles & Permissions */
const RolesSection = ({ currentUserId }: { currentUserId?: string }) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: profiles = [] } = useQuery({
    queryKey: ['settings-profiles'],
    queryFn: async () => (await supabase.from('profiles').select('*').order('created_at', { ascending: false })).data || [],
  });
  const { data: roles = [] } = useQuery({
    queryKey: ['settings-roles'],
    queryFn: async () => (await supabase.from('user_roles').select('*')).data || [],
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      // Remove existing admin/moderator role rows for this user, then insert chosen one (unless 'user')
      const { error: delErr } = await supabase.from('user_roles').delete().eq('user_id', userId).in('role', ['admin', 'moderator'] as any);
      if (delErr) throw delErr;
      if (role !== 'user') {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-roles'] });
      toast.success('Role updated');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const getRole = (uid: string): Role => {
    const r = roles.find((x: any) => x.user_id === uid && (x.role === 'admin' || x.role === 'moderator'));
    return (r?.role as Role) || 'user';
  };

  const counts = {
    admin: roles.filter((r: any) => r.role === 'admin').length,
    moderator: roles.filter((r: any) => r.role === 'moderator').length,
    user: profiles.length - roles.filter((r: any) => r.role === 'admin' || r.role === 'moderator').length,
  };

  const filtered = profiles.filter((p: any) => (p.display_name || '').toLowerCase().includes(search.toLowerCase()));

  const roleBadge = (r: Role) => {
    const cls = r === 'admin' ? 'text-[#ec9f00] bg-[#ec9f00]/10'
              : r === 'moderator' ? 'text-sky-400 bg-sky-400/10'
              : 'text-gray-400 bg-gray-400/10';
    return <span className={`text-[9px] uppercase tracking-[0.1em] font-bold px-2.5 py-1 rounded-full ${cls}`}>{r}</span>;
  };

  return (
    <div className="space-y-4">
      <Card title="Permission Tiers" desc="Spark uses three permission levels. Only super-admins can promote or demote teammates.">
        <div className="grid sm:grid-cols-3 gap-3">
          {([
            { role: 'admin' as Role, label: 'Admin', count: counts.admin, perms: ['Full access', 'Manage roles', 'Delete data'] },
            { role: 'moderator' as Role, label: 'Moderator', count: counts.moderator, perms: ['Edit content', 'Publish posts', 'Manage events'] },
            { role: 'user' as Role, label: 'User', count: counts.user, perms: ['Browse programs', 'Enroll', 'Submit progress'] },
          ]).map(t => (
            <div key={t.role} className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
              <div className="flex items-center justify-between mb-2">{roleBadge(t.role)}<span className="text-[18px] font-extrabold text-white">{t.count}</span></div>
              <ul className="space-y-1 text-[11px] text-gray-400">
                {t.perms.map(p => <li key={p}>• {p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Team Members" desc="Promote users to moderator or admin. Demoting yourself will lock you out.">
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2 mb-3 border border-white/5">
          <Search className="w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." className="bg-transparent text-sm text-white outline-none flex-1 placeholder:text-gray-600" />
        </div>
        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
          {filtered.map((p: any) => {
            const role = getRole(p.user_id);
            const isSelf = p.user_id === currentUserId;
            return (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-[#ec9f00]/15 flex items-center justify-center text-[11px] font-bold text-[#ec9f00] shrink-0">
                  {(p.display_name || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-white truncate">{p.display_name || 'Anonymous'} {isSelf && <span className="text-[10px] text-gray-500">(you)</span>}</div>
                  <div className="text-[10px] text-gray-500">Joined {format(new Date(p.created_at), 'MMM dd, yyyy')}</div>
                </div>
                {roleBadge(role)}
                <select
                  value={role}
                  onChange={e => setRole.mutate({ userId: p.user_id, role: e.target.value as Role })}
                  className="bg-white/5 border border-white/10 text-white text-[11px] rounded-lg px-2 py-1.5 outline-none focus:border-[#ec9f00]/50"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">No users found.</p>}
        </div>
      </Card>

      <Card title="Invite an Admin" desc="Send a password reset to an existing user's email so they can claim the account, then promote them above.">
        <p className="text-[11px] text-gray-500">New admins must first sign up at <code className="text-[#ec9f00]">/spark/auth</code>. Once they have an account, find them in the list above and switch their role to <strong className="text-white">Admin</strong>.</p>
      </Card>
    </div>
  );
};

/* General */
const GeneralSection = () => {
  const [siteName, setSiteName] = useState('Spark by iBloov');
  const [contactEmail, setContactEmail] = useState('hello@spark.ibloov.com');
  const [tagline, setTagline] = useState('Where African creatives ignite their next chapter.');
  return (
    <Card title="Site Preferences" desc="Public-facing brand metadata used across the Spark site.">
      <div className="space-y-4">
        <Field label="Site Name"><input value={siteName} onChange={e => setSiteName(e.target.value)} className={inputCls} /></Field>
        <Field label="Contact Email"><input value={contactEmail} onChange={e => setContactEmail(e.target.value)} className={inputCls} /></Field>
        <Field label="Tagline"><input value={tagline} onChange={e => setTagline(e.target.value)} className={inputCls} /></Field>
        <button onClick={() => toast.success('Preferences saved')} className={btnPrimary}>Save Preferences</button>
      </div>
    </Card>
  );
};

/* Notifications */
const NotificationsSection = () => {
  const [n, setN] = useState({ registrations: true, events: true, comments: false, analytics: true, security: true });
  return (
    <Card title="Notifications" desc="Choose which events trigger an admin email or in-app alert.">
      <div className="space-y-3">
        {([
          ['registrations', 'New user registrations'],
          ['events', 'Event sign-ups'],
          ['comments', 'Blog post comments'],
          ['analytics', 'Weekly analytics digest'],
          ['security', 'Security alerts (failed logins)'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between cursor-pointer group py-1">
            <span className="text-sm text-gray-300">{label}</span>
            <button onClick={() => setN(s => ({ ...s, [key]: !s[key as keyof typeof s] }))}
              className={`w-10 h-5 rounded-full relative transition-colors ${n[key as keyof typeof n] ? 'bg-[#ec9f00]' : 'bg-white/10'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${n[key as keyof typeof n] ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </label>
        ))}
      </div>
    </Card>
  );
};

/* Danger */
const DangerSection = () => {
  const [confirm, setConfirm] = useState('');
  return (
    <Card title="Danger Zone" desc="Irreversible actions that affect your entire Spark instance." tone="danger">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
          <div>
            <div className="text-[13px] font-bold text-white">Reset all unpublished drafts</div>
            <div className="text-[11px] text-gray-500">Removes every blog post and event marked as draft.</div>
          </div>
          <button onClick={() => toast.error('This is a demo — no data was deleted.')} className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">Reset Drafts</button>
        </div>
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
          <div>
            <div className="text-[13px] font-bold text-white">Purge media library</div>
            <div className="text-[11px] text-gray-500">Deletes every uploaded file. This cannot be undone.</div>
          </div>
          <button onClick={() => toast.error('This is a demo — no media was purged.')} className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">Purge Media</button>
        </div>
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
          <div className="text-[13px] font-bold text-white mb-1">Type <code className="text-red-400">DELETE</code> to enable factory reset</div>
          <div className="text-[11px] text-gray-500 mb-2">Wipes every user, role, program and analytics record.</div>
          <div className="flex gap-2">
            <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Type DELETE" className={inputCls} />
            <button disabled={confirm !== 'DELETE'} onClick={() => { toast.error('Demo mode — factory reset is disabled.'); setConfirm(''); }} className="text-[11px] tracking-[0.08em] uppercase font-bold px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap">Factory Reset</button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SparkAdmin;
