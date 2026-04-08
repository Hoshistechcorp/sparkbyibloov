import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { SparkReferDialog } from '@/components/spark/SparkReferDialog';

const SparkPrograms = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [referOpen, setReferOpen] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ['spark-programs'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_programs').select('*').eq('published', true).order('sort_order', { ascending: true });
      return data || [];
    },
  });

  return (
    <>
      <SEOHead title="Spark Programs — Micro-Credentials That Hit Different" description="8 industry-leading micro-credential programs in hospitality, events & tourism." />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="programs" />

        <section className="pt-24 md:pt-32 pb-10 md:pb-16 px-4 md:px-12 max-w-7xl mx-auto">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-4 block">Micro-Credential Programs</span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900 leading-[0.95]">
            Spark Programs.<br />
            <span className="bg-gradient-to-r from-[#ec9f00] via-[#f0b840] to-[#00C896] bg-clip-text text-transparent">Zero fluff.</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Each program is a stackable micro-credential — learn at your pace, earn real certifications, and build a career portfolio. <span className="text-gray-300">More programs launching soon.</span>
          </p>
        </section>

        <section className="px-4 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {programs.map((p: any) => (
              <Link to={`/spark/programs/${p.id}`} key={p.id} className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl block"
                style={{ minHeight: '280px' }} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className="absolute inset-0">
                  <img src={p.image_url || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop'} alt={p.cool_name} className="w-full h-full object-cover" style={{ animation: `kenburns ${15 + p.sort_order * 2}s ease-in-out infinite alternate` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/70 group-hover:to-black/40" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-8" style={{ minHeight: '280px' }}>
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-2.5 md:px-3 py-1 rounded-full border text-white" style={{ borderColor: p.color + '80', backgroundColor: p.color + '30' }}>
                      {p.tag}
                    </span>
                    <span className="text-[10px] text-white/60 tracking-wider font-semibold">{p.duration} · {p.lessons} lessons</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{p.cool_name}</h2>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/60 mb-2 md:mb-3 font-bold">{p.real_name}</p>

                  <p className={`text-sm text-white/80 leading-relaxed max-w-md transition-all duration-500 md:${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {p.description}
                  </p>

                  <div className={`flex gap-2 md:gap-3 mt-3 md:mt-4 transition-all duration-500 md:${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {p.status === 'coming_soon' ? (
                      <span className="text-[10px] tracking-[0.12em] uppercase font-extrabold px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-white/20 text-white/90 border border-white/30 backdrop-blur-sm">
                        Coming Soon
                      </span>
                    ) : (
                      <button className="text-[10px] tracking-[0.12em] uppercase font-extrabold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-colors"
                        style={{ backgroundColor: p.color, color: '#fff' }}>
                        Enroll Now
                      </button>
                    )}
                    {p.youtube_url && (
                      <a href={p.youtube_url} target="_blank" rel="noopener noreferrer" className="group/btn flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/30 text-white/90 hover:bg-white/10 hover:border-white/50 transition-all">
                        <svg className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Watch About
                      </a>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 md:top-6 right-4 md:right-6 text-4xl md:text-6xl font-extrabold text-white/15 z-10">0{p.sort_order}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 md:px-6 text-center bg-gray-50">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">Can't decide?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Take our 2-minute quiz to find the perfect program for your goals, schedule, and vibe.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25">
              Find My Program →
            </button>
            <button
              onClick={() => setReferOpen(true)}
              className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Refer a Friend
            </button>
          </div>
        </section>
        <SparkReferDialog open={referOpen} onClose={() => setReferOpen(false)} />
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkPrograms;
