import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';

const programs = [
  { id: '1', coolName: 'The Architect', realName: 'Advanced Event Planning & Creative Organizing', tag: 'FLAGSHIP', desc: 'Go beyond logistics — master strategic budgeting, risk management, and immersive concept development that transforms ordinary events into extraordinary, high-impact experiences.', duration: '12 weeks', lessons: 36, color: '#c48500', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-architect' },
  { id: '2', coolName: 'Da Plotter', realName: 'Professional Tourist Guide', tag: 'CORE', desc: 'Customer service, public speaking, cultural knowledge, and group management. Design engaging tours and handle the unexpected with confidence.', duration: '8 weeks', lessons: 24, color: '#7B61FF', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-plotter' },
  { id: '3', coolName: 'The Alchemist', realName: 'Professional Mixology & Bartending', tag: 'CORE', desc: 'In-depth training in cocktail crafting, bar management, and customer engagement in hospitality settings.', duration: '10 weeks', lessons: 30, color: '#FF6B35', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-alchemist' },
  { id: '4', coolName: 'The Gatekeeper', realName: 'Concierge & Waitstaff Excellence', tag: 'ESSENTIAL', desc: 'Professional etiquette, crowd management, crisis handling, and service techniques for events, conferences, and hospitality settings.', duration: '6 weeks', lessons: 18, color: '#00C896', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-gatekeeper' },
  { id: '5', coolName: 'The Voice', realName: 'Orators — MC Bootcamp', tag: 'SIGNATURE', desc: 'Stage command, audience engagement, improvisation, microphone techniques, and crowd control.', duration: '8 weeks', lessons: 24, color: '#FF3366', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-voice' },
  { id: '6', coolName: 'The Narrator', realName: 'Storyteller — TikTok Content for Events', tag: 'TRENDING', desc: 'Create compelling short-form videos for events, venues, and hospitality brands. Storytelling, editing, trends, and monetization.', duration: '6 weeks', lessons: 20, color: '#ec9f00', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-narrator' },
  { id: '7', coolName: 'The Lens', realName: 'Visual Storytelling — Photo & Video', tag: 'CREATIVE', desc: 'Photography and videography for compelling narratives. Composition, lighting, editing, and portfolio development.', duration: '10 weeks', lessons: 32, color: '#7B61FF', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-lens' },
  { id: '8', coolName: 'The Selector', realName: 'DJ Arts & Music Industry', tag: 'SIGNATURE', desc: 'Mixing, scratching, beat-matching, set curation, music theory, audio engineering, and the business side of the music industry.', duration: '12 weeks', lessons: 36, color: '#FF6B35', image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=400&fit=crop', youtube: 'https://youtube.com/@spark-selector' },
];

const SparkPrograms = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
            {programs.map((p) => (
              <div key={p.id} className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
                style={{ minHeight: '280px' }} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className="absolute inset-0">
                  <img src={p.image} alt={p.coolName} className="w-full h-full object-cover" style={{ animation: `kenburns ${15 + Number(p.id) * 2}s ease-in-out infinite alternate` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 transition-all duration-500 group-hover:from-black/95 group-hover:via-black/70 group-hover:to-black/40" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-end p-5 md:p-8" style={{ minHeight: '280px' }}>
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-2.5 md:px-3 py-1 rounded-full border text-white" style={{ borderColor: p.color + '80', backgroundColor: p.color + '30' }}>
                      {p.tag}
                    </span>
                    <span className="text-[10px] text-white/60 tracking-wider font-semibold">{p.duration} · {p.lessons} lessons</span>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{p.coolName}</h2>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/60 mb-2 md:mb-3 font-bold">{p.realName}</p>

                  <p className={`text-sm text-white/80 leading-relaxed max-w-md transition-all duration-500 md:${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {p.desc}
                  </p>

                  <div className={`flex gap-2 md:gap-3 mt-3 md:mt-4 transition-all duration-500 md:${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="text-[10px] tracking-[0.12em] uppercase font-extrabold px-4 md:px-5 py-2 md:py-2.5 rounded-full transition-colors"
                      style={{ backgroundColor: p.color, color: '#fff' }}>
                      Enroll Now
                    </button>
                    <a href={p.youtube} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.12em] uppercase font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/30 text-white/90 hover:bg-white/10 transition-colors">
                      About
                    </button>
                  </div>
                </div>

                <div className="absolute top-4 md:top-6 right-4 md:right-6 text-4xl md:text-6xl font-extrabold text-white/15 z-10">0{p.id}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 md:px-6 text-center bg-gray-50">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">Can't decide?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Take our 2-minute quiz to find the perfect program for your goals, schedule, and vibe.</p>
          <button className="bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25">
            Find My Program →
          </button>
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkPrograms;
