import React, { useState } from 'react';

const audiences = [
  {
    id: 'learners',
    label: 'Learners',
    tagline: 'Skip the boring. Learn by doing.',
    cards: [
      { title: 'Micro-Credentials', desc: '15-minute lessons that fit your flow. Stack real skills — not just degrees.' },
      { title: 'Creator-Led', desc: 'Learn from TikTokers, DJs, and event creators who actually do this stuff IRL.' },
      { title: 'Side Hustle Ready', desc: 'Turn skills into gigs — bartend a festival, MC a wedding, shoot content for brands.' },
      { title: 'Gamified & Fun', desc: 'XP, badges, and streaks that make learning feel like leveling up in your favorite game.' },
      { title: 'Community First', desc: 'Cohort-based learning with peers who get it. Discord vibes, university-level rigor.' },
      { title: 'Early Career Boost', desc: 'Build a portfolio before you even need a résumé. Get ahead of the curve.' },
    ],
  },
  {
    id: 'partners',
    label: 'Training Partners',
    tagline: 'Scale your impact. We handle the platform.',
    cards: [
      { title: 'White-Label Ready', desc: "Deploy your curriculum on Spark's infrastructure. Your brand, our tech." },
      { title: 'Revenue Share', desc: 'Fair, transparent revenue splits. Grow your reach without the overhead.' },
      { title: 'Analytics Dashboard', desc: 'Track learner outcomes, completion rates, and engagement — in real-time.' },
      { title: 'Global Distribution', desc: 'Access 40+ cities and FIFA host city markets instantly.' },
    ],
  },
  {
    id: 'experts',
    label: 'Leading Experts',
    tagline: 'Your knowledge deserves a bigger stage.',
    cards: [
      { title: 'Teach Your Way', desc: 'Record once, earn forever. We handle production, distribution, and learner support.' },
      { title: 'Expert Branding', desc: 'Get featured as a verified Spark expert. Build your personal brand alongside us.' },
      { title: 'Flexible Commitment', desc: 'Guest lecture, build a full course, or mentor 1-on-1. You set the terms.' },
      { title: 'Impact Metrics', desc: "See exactly how many careers you're shaping. Real data, real outcomes." },
    ],
  },
];

export const SparkAudience = () => {
  const [active, setActive] = useState('learners');
  const current = audiences.find((a) => a.id === active)!;

  return (
    <section id="audiences" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block">Built for everyone</span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Who is Spark for?</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {audiences.map((a) => (
          <button
            key={a.id}
            onClick={() => setActive(a.id)}
            className={`text-[12px] tracking-[0.1em] uppercase px-5 py-2.5 rounded-full font-bold transition-all ${
              active === a.id
                ? 'bg-[#CCFF00] text-gray-900 shadow-md shadow-[#CCFF00]/20'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <p className="text-2xl md:text-3xl font-light text-gray-400 mb-10">{current.tagline}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {current.cards.map((card) => (
          <div
            key={card.title}
            className="group bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:bg-[#CCFF00]/5 hover:border-[#CCFF00]/30 transition-all hover:shadow-lg hover:shadow-[#CCFF00]/5"
          >
            <h3 className="text-lg font-bold mb-2 group-hover:text-[#65A300] transition-colors text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
