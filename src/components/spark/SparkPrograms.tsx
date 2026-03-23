import React, { useState } from 'react';

const programs = [
  { id: '1', title: 'Advanced Event Planning & Creative Organizing', tag: 'FLAGSHIP', desc: 'Go beyond logistics — master strategic budgeting, risk management, and immersive concept development that transforms ordinary events into extraordinary, high-impact experiences.', color: '#65A300' },
  { id: '2', title: 'Professional Tourist Guide', tag: 'CORE', desc: 'Customer service, public speaking, cultural knowledge, and group management. Design engaging tours and handle the unexpected with confidence.', color: '#7B61FF' },
  { id: '3', title: 'Professional Mixology & Bartending', tag: 'CORE', desc: 'In-depth training in cocktail crafting, bar management, and customer engagement in hospitality settings.', color: '#FF6B35' },
  { id: '4', title: 'Concierge & Waitstaff Excellence', tag: 'ESSENTIAL', desc: 'Professional etiquette, crowd management, crisis handling, and service techniques for events, conferences, and hospitality settings.', color: '#00C896' },
  { id: '5', title: 'Orators — MC Bootcamp', tag: 'SIGNATURE', desc: 'Stage command, audience engagement, improvisation, microphone techniques, and crowd control. Own every room you walk into.', color: '#FF3366' },
  { id: '6', title: 'Storyteller — TikTok Content for Events', tag: 'TRENDING', desc: 'Create compelling short-form videos for events, venues, and hospitality brands. Storytelling, editing, trends, and monetization strategies.', color: '#CCFF00' },
  { id: '7', title: 'Visual Storytelling — Photo & Video', tag: 'CREATIVE', desc: 'Photography and videography for compelling narratives. Composition, lighting, pre-production, editing, and portfolio development.', color: '#7B61FF' },
  { id: '8', title: 'DJ Arts & Music Industry', tag: 'SIGNATURE', desc: 'Mixing, scratching, beat-matching, set curation, music theory, audio engineering, and the business side of the music industry.', color: '#FF6B35' },
];

export const SparkPrograms = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="programs" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block">Micro-Learning Programs</span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">8 programs. Zero fluff.</h2>
        <p className="text-lg text-gray-400 max-w-2xl">Each program is designed as stackable micro-credentials — learn at your own pace, earn real certifications, and build a career portfolio.</p>
      </div>

      <div className="space-y-3">
        {programs.map((p) => (
          <div
            key={p.id}
            className="group border border-gray-100 rounded-xl hover:border-[#CCFF00]/40 transition-all cursor-pointer bg-white hover:shadow-md"
            onClick={() => setExpanded(expanded === p.id ? null : p.id)}
          >
            <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6">
              <span className="text-[11px] tracking-[0.2em] text-gray-300 font-mono w-6">0{p.id}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-2.5 py-1 rounded-full border" style={{ color: p.color === '#CCFF00' ? '#65A300' : p.color, borderColor: (p.color === '#CCFF00' ? '#65A300' : p.color) + '40', backgroundColor: (p.color === '#CCFF00' ? '#CCFF00' : p.color) + '10' }}>
                {p.tag}
              </span>
              <h3 className="text-sm md:text-base font-bold flex-1 group-hover:text-[#65A300] transition-colors text-gray-800">{p.title}</h3>
              <span className="text-gray-300 text-xl transition-transform" style={{ transform: expanded === p.id ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
            </div>
            {expanded === p.id && (
              <div className="px-5 md:px-6 pb-6 pt-0">
                <p className="text-sm text-gray-500 leading-relaxed max-w-3xl ml-10 md:ml-12">{p.desc}</p>
                <div className="flex gap-3 mt-4 ml-10 md:ml-12">
                  <button className="text-[10px] tracking-[0.12em] uppercase font-extrabold px-5 py-2.5 bg-[#CCFF00] text-gray-900 rounded-full hover:bg-[#B8E600] transition-colors shadow-sm">
                    Enroll Now
                  </button>
                  <button className="text-[10px] tracking-[0.12em] uppercase font-bold px-5 py-2.5 border border-gray-200 text-gray-400 rounded-full hover:border-gray-300 transition-colors">
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
