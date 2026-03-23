import React from 'react';

const partnerTypes = [
  {
    type: 'Academic Partners',
    desc: 'Universities, colleges, and training institutes — co-develop curriculum and offer accredited micro-credentials.',
    benefits: ['Co-branded certificates', 'Revenue share model', 'Access to 50K+ learners', 'Curriculum co-development'],
    cta: 'Apply as Academic Partner',
    accent: '#7B61FF',
  },
  {
    type: 'Employer Partners',
    desc: 'Hotels, event companies, tourism boards — sponsor learners, access pre-vetted talent, and upskill your workforce.',
    benefits: ['Talent pipeline access', 'Custom upskilling tracks', 'Tuition sponsorship', 'Workforce analytics'],
    cta: 'Explore Employer Plans',
    accent: '#CCFF00',
  },
  {
    type: 'Icon Partners',
    desc: 'Celebrity chefs, renowned DJs, top photographers — teach what you know, earn while you impact.',
    benefits: ['Personal brand amplification', 'Passive income stream', 'Production support', 'Global audience reach'],
    cta: 'Become an Icon',
    accent: '#FF6B35',
  },
  {
    type: 'Municipal Partners',
    desc: 'City governments, FIFA host cities, tourism authorities — train your citizens for the opportunities coming to your city.',
    benefits: ['City-wide training rollout', 'FIFA readiness programs', 'Economic impact reporting', 'Youth employment pipeline'],
    cta: 'Schedule Consultation',
    accent: '#00FFB2',
  },
];

export const SparkPartners = () => (
  <section id="partners" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
    <div className="mb-12">
      <span className="text-[11px] tracking-[0.3em] uppercase text-[#CCFF00]/70 mb-3 block">Partnerships</span>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Build with us.</h2>
      <p className="text-lg text-white/40 max-w-2xl">Spark is an ecosystem, not just a platform. We partner with institutions, employers, icons, and cities to create real impact.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partnerTypes.map((p) => (
        <div key={p.type} className="bg-white/[0.02] border border-white/5 p-8 flex flex-col hover:border-white/10 transition-all group">
          <div className="w-3 h-3 rounded-full mb-4" style={{ backgroundColor: p.accent }} />
          <h3 className="text-xl font-semibold mb-2">{p.type}</h3>
          <p className="text-sm text-white/40 leading-relaxed mb-6">{p.desc}</p>
          <ul className="space-y-2 mb-8 flex-1">
            {p.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-white/50">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: p.accent }} />
                {b}
              </li>
            ))}
          </ul>
          <button
            className="text-[10px] tracking-[0.15em] uppercase font-bold px-5 py-3 border transition-all hover:text-black w-full text-center"
            style={{ borderColor: p.accent, color: p.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = p.accent; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = p.accent; }}
          >
            {p.cta}
          </button>
        </div>
      ))}
    </div>
  </section>
);
