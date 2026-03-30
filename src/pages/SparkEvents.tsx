import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { MapPin, Calendar, Globe, ExternalLink } from 'lucide-react';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';

const SparkEvents = () => {
  const [filter, setFilter] = useState<'all' | 'workshop' | 'bootcamp' | 'webinar' | 'meetup'>('all');

  const { data: sparkEvents = [] } = useQuery({
    queryKey: ['spark-events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('spark_events').select('*').eq('published', true).order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: iblooVEvents = [] } = useQuery({
    queryKey: ['ibloov-events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('events').select('*').order('target_date', { ascending: true }).limit(6);
      if (error) throw error;
      return data;
    },
  });

  const allEvents = [
    ...sparkEvents.map((e: any) => ({ id: e.id, title: e.title, description: e.description, date: e.date, location: e.location, image: e.cover_image_url, type: e.event_type, isVirtual: e.is_virtual, registrationUrl: e.registration_url, source: 'spark' as const })),
    ...iblooVEvents.map((e: any) => ({ id: e.id, title: e.title, description: e.description, date: e.target_date, location: e.address, image: e.background_image_url, type: 'event', isVirtual: false, registrationUrl: `/event/${e.id}`, source: 'ibloov' as const })),
  ];

  const filtered = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter);

  return (
    <>
      <SEOHead title="Spark Events — Workshops, Bootcamps & More" description="Join Spark workshops, bootcamps, and live events in hospitality, events & tourism." />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="events" />

        <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-4 block">Events</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900 leading-[0.95]">
            Learn live.<br />
            <span className="bg-gradient-to-r from-[#ec9f00] via-[#f0b840] to-[#00C896] bg-clip-text text-transparent">Connect IRL.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base md:text-lg text-gray-400 max-w-2xl">
            Workshops, bootcamps, networking events, and live experiences across Africa and beyond.
          </motion.p>
        </section>

        <section className="px-4 md:px-12 max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2">
            {(['all', 'workshop', 'bootcamp', 'conference', 'meetup'] as const).map(t => (
              <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(t)}
                className={`text-[11px] tracking-[0.1em] uppercase px-3 md:px-4 py-2 rounded-full font-bold transition-all ${filter === t ? 'bg-[#ec9f00] text-white shadow-md' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                {t === 'all' ? 'All Events' : t}
              </motion.button>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <p className="text-2xl font-bold text-gray-300 mb-2">No events yet</p>
              <p className="text-gray-400">Check back soon — exciting things are coming!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="relative h-40 md:h-48 overflow-hidden bg-gray-100">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#ec9f00]/20 to-[#00C896]/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-[#c48500]/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2.5 py-1 rounded-full bg-white/90 text-gray-700 backdrop-blur-sm">{event.type}</span>
                      {event.isVirtual && <span className="text-[9px] tracking-[0.15em] uppercase font-bold px-2.5 py-1 rounded-full bg-[#ec9f00] text-white flex items-center gap-1"><Globe className="w-3 h-3" />Virtual</span>}
                    </div>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-[11px] text-[#c48500] font-bold mb-2">{event.date ? format(new Date(event.date), 'MMM dd, yyyy · h:mm a') : 'Date TBD'}</p>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-[#c48500] transition-colors">{event.title}</h3>
                    {event.description && <p className="text-sm text-gray-400 line-clamp-2 mb-3">{event.description}</p>}
                    {event.location && <p className="text-[11px] text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                    {event.registrationUrl && (
                      <Link to={event.registrationUrl} className="mt-3 inline-flex items-center gap-1 text-[10px] tracking-[0.12em] uppercase font-extrabold text-[#c48500] hover:text-[#a06d00] transition-colors">
                        Register <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkEvents;
