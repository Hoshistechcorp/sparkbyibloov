import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { Play, Image as ImageIcon } from 'lucide-react';

const SparkMedia = () => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  const { data: media = [] } = useQuery({
    queryKey: ['public-spark-media'],
    queryFn: async () => {
      const { data, error } = await supabase.from('spark_media').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filter === 'all' ? media : media.filter((m: any) => m.file_type === filter);

  return (
    <>
      <SEOHead title="Spark Media — See the Journey" description="Photos, videos, and behind-the-scenes content from Spark by iBloov Learning programs." />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="media" />

        <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-4 block">Gallery</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900 leading-[0.95]">
            See the<br />
            <span className="text-[#ec9f00]">journey.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base md:text-lg text-gray-400 max-w-2xl">
            Photos, videos, and behind-the-scenes moments from our programs, events, and learner experiences.
          </motion.p>
        </section>

        <section className="px-4 md:px-12 max-w-7xl mx-auto mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2">
            {(['all', 'image', 'video'] as const).map(t => (
              <motion.button key={t} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setFilter(t)}
                className={`text-[11px] tracking-[0.1em] uppercase px-4 py-2 rounded-full font-bold transition-all ${filter === t ? 'bg-[#ec9f00] text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                {t === 'all' ? 'All Media' : t === 'image' ? 'Photos' : 'Videos'}
              </motion.button>
            ))}
          </div>
        </section>

        <section className="px-4 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-300 mb-2">No media yet</p>
              <p className="text-gray-400">Check back soon — we're capturing great moments!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((item: any, i: number) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="group rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  {item.file_type === 'video' ? (
                    <div className="aspect-video relative bg-gray-900">
                      {item.file_url.includes('youtube') || item.file_url.includes('youtu.be') ? (
                        <iframe src={item.file_url.replace('watch?v=', 'embed/')} title={item.title || 'Video'} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      ) : (
                        <video src={item.file_url} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video overflow-hidden">
                      <img src={item.file_url} alt={item.title || 'Media'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  {item.title && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        {item.file_type === 'video' ? <Play className="w-3.5 h-3.5 text-[#ec9f00]" /> : <ImageIcon className="w-3.5 h-3.5 text-[#ec9f00]" />}
                        <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{item.file_type}</span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <section className="py-16 md:py-20 px-4 md:px-6 text-center bg-gray-50">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">Want to be featured?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join a Spark program and your story could be here next.</p>
          <Link to="/spark/programs" className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all">
            Explore Programs →
          </Link>
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkMedia;
