import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, MapPin, Globe, ExternalLink, Pencil, Save, X, Trash2 } from 'lucide-react';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { toast } from 'sonner';

const SparkEventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      }
    })();
  }, []);

  const { data: event, isLoading } = useQuery({
    queryKey: ['spark-event', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('spark_events').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (event && !form) {
      setForm({
        title: event.title,
        description: event.description || '',
        date: event.date ? format(new Date(event.date), "yyyy-MM-dd'T'HH:mm") : '',
        location: event.location || '',
        cover_image_url: event.cover_image_url || '',
        event_type: event.event_type,
        is_virtual: event.is_virtual,
        registration_url: event.registration_url || '',
        published: event.published,
      });
    }
  }, [event, form]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      const { error } = await supabase.from('spark_events').update(payload).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spark-event', id] });
      queryClient.invalidateQueries({ queryKey: ['spark-events'] });
      setEditing(false);
      toast.success('Event updated!');
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('spark_events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Event deleted');
      navigate('/spark/events');
    },
  });

  if (isLoading) return (
    <div className="bg-white min-h-screen font-[Nunito]">
      <SparkSubNav activeLink="events" />
      <div className="pt-32 flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#ec9f00] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!event) return (
    <div className="bg-white min-h-screen font-[Nunito]">
      <SparkSubNav activeLink="events" />
      <div className="pt-32 text-center py-20">
        <h1 className="text-2xl font-bold text-gray-300 mb-2">Event not found</h1>
        <Link to="/spark/events" className="text-[#ec9f00] font-bold hover:underline">← Back to Events</Link>
      </div>
      <SparkFooter />
    </div>
  );

  return (
    <>
      <SEOHead title={`${event.title} — Spark Events`} description={event.description || ''} />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="events" />

        <div className="w-full h-64 md:h-[420px] overflow-hidden relative bg-gray-100">
          {event.cover_image_url ? (
            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#ec9f00]/20 to-[#00C896]/20 flex items-center justify-center">
              <Calendar className="w-20 h-20 text-[#c48500]/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>

        <article className="max-w-3xl mx-auto px-4 md:px-8 -mt-20 relative z-10 pb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
            <div className="flex items-center justify-between mb-6">
              <Link to="/spark/events" className="inline-flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase font-bold text-[#ec9f00] hover:text-[#c48500] transition-colors">
                <ArrowLeft className="w-4 h-4" /> All Events
              </Link>
              {isAdmin && !editing && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase font-bold bg-[#ec9f00] text-white px-3 py-2 rounded-lg hover:bg-[#d48e00] transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => { if (confirm('Delete this event?')) deleteMutation.mutate(); }} className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.08em] uppercase font-bold bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>

            {editing && form ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-extrabold text-gray-900">Edit Event</h2>
                  <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                  <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none">
                    <option value="workshop">Workshop</option><option value="bootcamp">Bootcamp</option><option value="webinar">Webinar</option><option value="meetup">Meetup</option><option value="masterclass">Masterclass</option><option value="conference">Conference</option>
                  </select>
                  <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                  <input placeholder="Registration URL" value={form.registration_url} onChange={e => setForm({ ...form, registration_url: e.target.value })} className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                </div>
                <input placeholder="Cover image URL" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#ec9f00] outline-none" />
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_virtual} onChange={e => setForm({ ...form, is_virtual: e.target.checked })} className="accent-[#ec9f00]" /> Virtual</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-[#ec9f00]" /> Published</label>
                </div>
                <button onClick={() => saveMutation.mutate()} disabled={!form.title || !form.date} className="inline-flex items-center gap-2 bg-[#ec9f00] text-white font-extrabold text-[11px] tracking-[0.08em] uppercase px-6 py-3 rounded-lg hover:bg-[#d48e00] transition-colors disabled:opacity-50">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full bg-[#ec9f00]/10 text-[#c48500] border border-[#ec9f00]/20">{event.event_type}</span>
                  {event.is_virtual && <span className="text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full bg-[#ec9f00] text-white flex items-center gap-1"><Globe className="w-3 h-3" /> Virtual</span>}
                  {!event.published && isAdmin && <span className="text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Draft</span>}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-6">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
                  {event.date && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(event.date), 'MMMM dd, yyyy · h:mm a')}</span>}
                  {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>}
                </div>
                {event.description && (
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed whitespace-pre-line mb-8">{event.description}</p>
                )}
                {event.registration_url && (
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all">
                    Register <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </article>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkEventDetails;