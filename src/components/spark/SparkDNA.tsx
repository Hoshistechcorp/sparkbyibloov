import React from 'react';

const pillars = [
  {
    source: 'Coursera',
    quality: 'Scale & Accessibility',
    desc: 'World-class content available to anyone, anywhere. No gatekeeping — just pure, democratized learning at scale.',
    icon: '🌍',
  },
  {
    source: 'Guild',
    quality: 'Employer Alignment',
    desc: 'Every program maps to real employer needs. Tuition support, career pathways, and outcomes that matter to hiring managers.',
    icon: '🤝',
  },
  {
    source: 'Yellowbrick',
    quality: 'Industry Production',
    desc: 'Celebrity instructors, immersive video, and brand-name partnerships that make learning feel premium and aspirational.',
    icon: '🎬',
  },
  {
    source: 'Harvard Online',
    quality: 'Academic Rigor',
    desc: 'Research-backed curriculum, peer-reviewed content, and credentials that carry weight in any boardroom.',
    icon: '🎓',
  },
];

export const SparkDNA = () => (
  <section id="dna" className="py-24 px-6 md:px-12 bg-[#0F0F0F]">
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#CCFF00]/70 mb-3 block">Platform DNA</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Four giants.<br />
          <span className="text-white/30">One Spark.</span>
        </h2>
        <p className="text-lg text-white/40 max-w-2xl">We studied what makes the world's best learning platforms great — then built something purpose-made for hospitality, events & tourism.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p) => (
          <div key={p.source} className="bg-white/[0.02] border border-white/5 p-8 hover:border-[#CCFF00]/20 transition-all group">
            <div className="text-3xl mb-4">{p.icon}</div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">Inspired by {p.source}</div>
            <h3 className="text-xl font-semibold mb-3 group-hover:text-[#CCFF00] transition-colors">{p.quality}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
