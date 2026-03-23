import React, { useState } from 'react';

const audiences = [
  {
    id: 'genz',
    label: 'Gen Z',
    tagline: 'Skip the boring. Learn by doing.',
    cards: [
      { title: 'Micro-Credentials', desc: '15-minute lessons that fit between your scrolls. Stack real skills, not just degrees.' },
      { title: 'Creator-Led', desc: 'Learn from TikTokers, DJs, and event creators who actually do this stuff IRL.' },
      { title: 'Side Hustle Ready', desc: 'Turn skills into gigs — bartend a festival, MC a wedding, shoot content for brands.' },
      { title: 'Community First', desc: 'Cohort-based learning with peers who get it. Discord vibes, university-level rigor.' },
    ],
  },
  {
    id: 'genalpha',
    label: 'Gen Alpha',
    tagline: 'The future starts before college.',
    cards: [
      { title: 'Gamified Learning', desc: 'XP, badges, and streaks that make learning feel like leveling up in your favorite game.' },
      { title: 'Safe & Guided', desc: 'Age-appropriate content with mentor oversight. Parents can track progress in real-time.' },
      { title: 'Creative Expression', desc: 'Visual storytelling, content creation, and event design — express yourself through doing.' },
      { title: 'Early Career Prep', desc: 'Build a portfolio before you even need a résumé. Get ahead of the curve.' },
    ],
  },
  {
    id: 'partners',
    label: 'Training Partners',
    tagline: 'Scale your impact. We handle the platform.',
    cards: [
      { title: 'White-Label Ready', desc: 'Deploy your curriculum on Spark\'s infrastructure. Your brand, our tech.' },
      { title: 'Revenue Share', desc: 'Fair, transparent revenue splits. Grow your reach without the overhead.' },
      { title: 'Analytics Dashboard', desc: 'Track learner outcomes, completion rates, and engagement — in real-time.' },
      { title: 'Global Distribution', desc: 'Access 40+ cities and 16 FIFA host city markets instantly.' },
    ],
  },
  {
    id: 'experts',
    label: 'Industry Experts',
    tagline: 'Your knowledge deserves a bigger stage.',
    cards: [
      { title: 'Teach Your Way', desc: 'Record once, earn forever. We handle production, distribution, and learner support.' },
      { title: 'Expert Branding', desc: 'Get featured as a verified Spark expert. Build your personal brand alongside us.' },
      { title: 'Flexible Commitment', desc: 'Guest lecture, build a full course, or mentor 1-on-1. You set the terms.' },
      { title: 'Impact Metrics', desc: 'See exactly how many careers you\'re shaping. Real data, real outcomes.' },
    ],
  },
];

export const SparkAudience = () => {
  const [active, setActive] = useState('genz');
  const current = audiences.find((a) => a.id === active)!;

  return (
    <section id="audiences" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#CCFF00]/70 mb-3 block">Built for everyone</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Who is Spark for?</h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {audiences.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            className={`text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 border transition-all ${
              active === a.id
                ? 'bg-[#CCFF00] text-black border-[#CCFF00] font-bold'
                : 'bg-transparent text-white/50 border-white/10 hover:border-white/30'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <p className="text-2xl md:text-3xl font-light text-white/60 mb-10">{current.tagline}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {current.cards.map((card) => (
          <div
            key={card.title}
            className="group bg-white/[0.03] border border-white/5 p-8 hover:bg-white/[0.06] hover:border-[#CCFF00]/20 transition-all"
          >
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#CCFF00] transition-colors">{card.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
