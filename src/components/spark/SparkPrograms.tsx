import React, { useState } from 'react';

const programs = [
  {
    id: '1',
    title: 'Advanced Event Planning & Creative Organizing',
    tag: 'FLAGSHIP',
    desc: 'Go beyond logistics — master strategic budgeting, risk management, and immersive concept development that transforms ordinary events into extraordinary, high-impact experiences.',
    color: '#CCFF00',
  },
  {
    id: '2',
    title: 'Professional Tourist Guide',
    tag: 'CORE',
    desc: 'Customer service, public speaking, cultural knowledge, and group management. Design engaging tours and handle the unexpected with confidence.',
    color: '#7B61FF',
  },
  {
    id: '3',
    title: 'Professional Mixology & Bartending',
    tag: 'CORE',
    desc: 'In-depth training in cocktail crafting, bar management, and customer engagement in hospitality settings. The art and science of mixology.',
    color: '#FF6B35',
  },
  {
    id: '4',
    title: 'Concierge & Waitstaff Excellence',
    tag: 'ESSENTIAL',
    desc: 'Professional etiquette, crowd management, crisis handling, and service techniques for events, conferences, corporate functions, and hospitality settings.',
    color: '#00FFB2',
  },
  {
    id: '5',
    title: 'Orators — MC Bootcamp',
    tag: 'SIGNATURE',
    desc: 'Stage command, audience engagement, improvisation, microphone techniques, and crowd control. Own every room you walk into.',
    color: '#FF3366',
  },
  {
    id: '6',
    title: 'Storyteller — TikTok Content for Events',
    tag: 'TRENDING',
    desc: 'Create compelling short-form videos for events, venues, and hospitality brands. Storytelling, editing, trends, and monetization strategies.',
    color: '#CCFF00',
  },
  {
    id: '7',
    title: 'Visual Storytelling — Photo & Video',
    tag: 'CREATIVE',
    desc: 'Photography and videography for compelling narratives. Composition, lighting, pre-production, editing, and portfolio development.',
    color: '#7B61FF',
  },
  {
    id: '8',
    title: 'DJ Arts & Music Industry',
    tag: 'SIGNATURE',
    desc: 'Mixing, scratching, beat-matching, set curation, music theory, audio engineering, and the business side of the music industry.',
    color: '#FF6B35',
  },
];

export const SparkPrograms = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="programs" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#CCFF00]/70 mb-3 block">Micro-Learning Programs</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">8 programs. Zero fluff.</h2>
        <p className="text-lg text-white/40 max-w-2xl">Each program is designed as stackable micro-credentials — learn at your own pace, earn real certifications, and build a career portfolio.</p>
      </div>

      <div className="space-y-2">
        {programs.map((p, i) => (
          <div
            key={p.id}
            className="group border border-white/5 hover:border-white/10 transition-all cursor-pointer"
            onClick={() => setExpanded(expanded === p.id ? null : p.id)}
          >
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6">
              <span className="text-[11px] tracking-[0.2em] text-white/20 font-mono w-6">0{p.id}</span>
              <span
                className="text-[9px] tracking-[0.2em] uppercase font-bold px-2 py-0.5 border"
                style={{ color: p.color, borderColor: p.color + '40' }}
              >
                {p.tag}
              </span>
              <h3 className="text-sm md:text-base font-medium flex-1 group-hover:text-[#CCFF00] transition-colors">{p.title}</h3>
              <span className="text-white/20 text-xl transition-transform" style={{ transform: expanded === p.id ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </div>
            {expanded === p.id && (
              <div className="px-5 md:px-6 pb-6 pt-0">
                <p className="text-sm text-white/40 leading-relaxed max-w-3xl ml-10 md:ml-12">{p.desc}</p>
                <div className="flex gap-3 mt-4 ml-10 md:ml-12">
                  <button className="text-[10px] tracking-[0.15em] uppercase font-bold px-4 py-2 bg-[#CCFF00] text-black hover:bg-[#B8E600] transition-colors">
                    Enroll Now
                  </button>
                  <button className="text-[10px] tracking-[0.15em] uppercase px-4 py-2 border border-white/10 text-white/50 hover:border-white/30 transition-colors">
                    View Syllabus
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
