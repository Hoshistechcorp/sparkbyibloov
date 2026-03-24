import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar, FileText, Image, BarChart3, Users, BookOpen, X, Menu, LogOut } from 'lucide-react';

type Tab = 'dashboard' | 'events' | 'blog' | 'programs' | 'media';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-[Nunito]"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin" /></div>;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center font-[Nunito] bg-gray-50 px-4">
      <div className="text-center">
        <img src={sparkLogo} alt="Spark" className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-6" />
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">Spark Admin</h1>
        <p className="text-gray-400 mb-6 text-sm">Please sign in to access the admin panel.</p>
        <Link to="/spark/auth" className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full hover:bg-[#B8E600] transition-all">Sign In</Link>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen flex items-center justify-center font-[Nunito] bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6 text-sm">You don't have admin privileges for Spark.</p>
        <Link to="/spark" className="text-[#65A300] font-bold hover:underline">← Back to Spark</Link>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'media', label: 'Media', icon: Image },
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
      <div className="bg-gray-50 text-gray-900 min-h-screen font-[Nunito]">
        {/* Top nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-1 text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <img src={sparkLogo} alt="Spark" className="h-7 w-7 md:h-8 md:w-8" />
            <span className="text-xs md:text-sm font-black tracking-[0.15em] uppercase">Spark Admin</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-[10px] md:text-xs text-gray-400 hidden sm:inline truncate max-w-[150px]">{user.email}</span>
            <Link to="/spark" className="text-[10px] md:text-[11px] tracking-[0.1em] uppercase font-bold text-[#CCFF00] hover:text-[#B8E600] transition-colors">Site →</Link>
            <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-white transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>

        <div className="pt-14 md:pt-16 flex">
          {/* Sidebar - Desktop always visible, mobile slide-in */}
          <>
            {/* Mobile overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}
            <aside className={`fixed left-0 top-14 md:top-16 bottom-0 w-56 bg-white border-r border-gray-100 p-4 space-y-1 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-[#CCFF00]/10 text-[#65A300]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </aside>
          </>

          {/* Content */}
          <main className="md:ml-56 flex-1 p-4 md:p-8 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'events' && <EventsTab />}
                {activeTab === 'blog' && <BlogTab />}
                {activeTab === 'programs' && <ProgramsTab />}
                {activeTab === 'media' && <MediaTab />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
};

const DashboardTab = () => {
  const { data: eventsCount = 0 } = useQuery({ queryKey: ['admin-events-count'], queryFn: async () => { const { count } = await supabase.from('spark_events').select('*', { count: 'exact', head: true }); return count || 0; } });
  const { data: postsCount = 0 } = useQuery({ queryKey: ['admin-posts-count'], queryFn: async () => { const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true }); return count || 0; } });

  const stats = [
    { label: 'Total Events', value: eventsCount, icon: Calendar, color: '#65A300' },
    { label: 'Blog Posts', value: postsCount, icon: FileText, color: '#7B61FF' },
    { label: 'Programs', value: 8, icon: BookOpen, color: '#FF6B35' },
    { label: 'Active Learners', value: '—', icon: Users, color: '#00C896' },
  ];

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <s.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: s.color }} />
              <span className="text-xl md:text-2xl font-extrabold">{s.value}</span>
            </div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.1em] text-gray-400 font-bold">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button className="text-[11px] tracking-[0.1em] uppercase font-bold px-3 md:px-4 py-2 rounded-lg bg-[#CCFF00]/10 text-[#65A300] hover:bg-[#CCFF00]/20 transition-colors">+ Create Event</button>
          <button className="text-[11px] tracking-[0.1em] uppercase font-bold px-3 md:px-4 py-2 rounded-lg bg-[#7B61FF]/10 text-[#7B61FF] hover:bg-[#7B61FF]/20 transition-colors">+ Write Post</button>
        </div>
      </div>
    </div>
  );
};

const EventsTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', location: '', cover_image_url: '', event_type: 'workshop', is_virtual: false, registration_url: '', published: false });

  const { data: events = [] } = useQuery({
    queryKey: ['admin-spark-events'],
    queryFn: async () => { const { data } = await supabase.from('spark_events').select('*').order('created_at', { ascending: false }); return data || []; },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, date: new Date(form.date).toISOString(), published_at: form.published ? new Date().toISOString() : null };
      if (editingEvent) {
        const { error } = await supabase.from('spark_events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('spark_events').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-events'] }); setShowForm(false); setEditingEvent(null); resetForm(); toast.success('Event saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('spark_events').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-spark-events'] }); toast.success('Event deleted'); },
  });

  const resetForm = () => setForm({ title: '', description: '', date: '', location: '', cover_image_url: '', event_type: 'workshop', is_virtual: false, registration_url: '', published: false });

  const openEdit = (e: any) => {
    setEditingEvent(e);
    setForm({ title: e.title, description: e.description || '', date: e.date ? format(new Date(e.date), "yyyy-MM-dd'T'HH:mm") : '', location: e.location || '', cover_image_url: e.cover_image_url || '', event_type: e.event_type, is_virtual: e.is_virtual, registration_url: e.registration_url || '', published: e.published });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold">Spark Events</h2>
        <button onClick={() => { resetForm(); setEditingEvent(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.1em] uppercase px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#B8E600] transition-colors">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Event</span>
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm md:text-base">{editingEvent ? 'Edit Event' : 'Create Event'}</h3>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <input placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="workshop">Workshop</option><option value="bootcamp">Bootcamp</option><option value="conference">Conference</option><option value="meetup">Meetup</option>
            </select>
            <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Registration URL" value={form.registration_url} onChange={e => setForm({ ...form, registration_url: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm md:col-span-2" rows={3} />
            <div className="flex items-center gap-4 md:gap-6">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_virtual} onChange={e => setForm({ ...form, is_virtual: e.target.checked })} className="rounded" /> Virtual</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" /> Published</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.date} className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.1em] uppercase px-5 md:px-6 py-2.5 rounded-lg hover:bg-[#B8E600] transition-colors disabled:opacity-50">
              {editingEvent ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="text-gray-400 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-gray-600">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {events.map((e: any) => (
          <div key={e.id} className="bg-white rounded-xl px-4 md:px-6 py-3 md:py-4 border border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {e.published ? <Eye className="w-4 h-4 text-[#65A300] flex-shrink-0" /> : <EyeOff className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{e.title}</p>
                <p className="text-[11px] text-gray-400 truncate">{e.event_type} · {e.date ? format(new Date(e.date), 'MMM dd, yyyy') : 'No date'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(e)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { if (confirm('Delete this event?')) deleteMutation.mutate(e.id); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No events yet. Create your first one!</p>}
      </div>
    </div>
  );
};

const BlogTab = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); setShowForm(false); setEditingPost(null); resetForm(); toast.success('Post saved!'); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('blog_posts').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] }); toast.success('Post deleted'); },
  });

  const resetForm = () => setForm({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author_name: 'Spark Team', category: 'news', published: false });

  const openEdit = (p: any) => {
    setEditingPost(p);
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', content: p.content, cover_image_url: p.cover_image_url || '', author_name: p.author_name, category: p.category, published: p.published });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-extrabold">Blog Posts</h2>
        <button onClick={() => { resetForm(); setEditingPost(null); setShowForm(true); }} className="flex items-center gap-2 bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.1em] uppercase px-3 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-[#B8E600] transition-colors">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Post</span>
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm md:text-base">{editingPost ? 'Edit Post' : 'Create Post'}</h3>
            <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <input placeholder="Post title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Slug (auto-generated)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <input placeholder="Author name" value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="news">News</option><option value="spotlight">Learner Spotlight</option><option value="industry">Industry Insights</option><option value="update">Program Update</option>
            </select>
            <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm md:col-span-2" />
            <textarea placeholder="Excerpt (short summary)" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm md:col-span-2" rows={2} />
            <textarea placeholder="Content (full article)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm md:col-span-2" rows={6} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" /> Publish now</label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.content} className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.1em] uppercase px-5 md:px-6 py-2.5 rounded-lg hover:bg-[#B8E600] transition-colors disabled:opacity-50">
              {editingPost ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingPost(null); }} className="text-gray-400 text-[11px] font-bold uppercase px-4 py-2.5 hover:text-gray-600">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {posts.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl px-4 md:px-6 py-3 md:py-4 border border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.published ? <Eye className="w-4 h-4 text-[#65A300] flex-shrink-0" /> : <EyeOff className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{p.title}</p>
                <p className="text-[11px] text-gray-400 truncate">{p.category} · {p.author_name}{p.published_at ? ` · ${format(new Date(p.published_at), 'MMM dd')}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
              <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(p.id); }} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center text-gray-400 py-8 text-sm">No posts yet. Write your first one!</p>}
      </div>
    </div>
  );
};

const ProgramsTab = () => (
  <div>
    <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6">Programs</h2>
    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100">
      <p className="text-gray-400 text-sm mb-4">Program management is coming soon. Currently, 8 micro-credential programs are configured.</p>
      <div className="space-y-2">
        {['The Architect', 'Da Plotter', 'The Alchemist', 'The Gatekeeper', 'The Voice', 'The Narrator', 'The Lens', 'The Selector'].map((name, i) => (
          <div key={name} className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-[11px] text-gray-300 font-mono">0{i + 1}</span>
              <span className="text-sm font-bold text-gray-700">{name}</span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.1em] font-bold text-[#65A300] bg-[#CCFF00]/10 px-2 py-1 rounded-full">Active</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MediaTab = () => (
  <div>
    <h2 className="text-xl md:text-2xl font-extrabold mb-4 md:mb-6">Media Gallery</h2>
    <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
      <Image className="w-12 h-12 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 text-sm">Media management coming soon. Visit the <Link to="/spark/media" className="text-[#65A300] font-bold hover:underline">media page</Link> to see current gallery.</p>
    </div>
  </div>
);

export default SparkAdmin;
