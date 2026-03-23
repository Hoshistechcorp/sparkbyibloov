import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { Link } from 'react-router-dom';

const programs = [
  {
    id: '1',
    coolName: 'The Architect',
    realName: 'Advanced Event Planning & Creative Organizing',
    tag: 'FLAGSHIP',
    desc: 'Go beyond logistics — master strategic budgeting, risk management, and immersive concept development that transforms ordinary events into extraordinary, high-impact experiences.',
    duration: '12 weeks',
    lessons: 36,
    color: '#65A300',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop',
  },
  {
    id: '2',
    coolName: 'Da Plotter',
    realName: 'Professional Tourist Guide',
    tag: 'CORE',
    desc: 'Customer service, public speaking, cultural knowledge, and group management. Design engaging tours and handle the unexpected with confidence.',
    duration: '8 weeks',
    lessons: 24,
    color: '#7B61FF',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
  },
  {
    id: '3',
    coolName: 'The Alchemist',
    realName: 'Professional Mixology & Bartending',
    tag: 'CORE',
    desc: 'In-depth training in cocktail crafting, bar management, and customer engagement in hospitality settings. The art and science of mixology.',
    duration: '10 weeks',
    lessons: 30,
    color: '#FF6B35',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
  },
  {
    id: '4',
    coolName: 'The Gatekeeper',
    realName: 'Concierge & Waitstaff Excellence',
    tag: 'ESSENTIAL',
    desc: 'Professional etiquette, crowd management, crisis handling, and service techniques for events, conferences, and hospitality settings.',
    duration: '6 weeks',
    lessons: 18,
    color: '#00C896',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
  },
  {
    id: '5',
    coolName: 'The Voice',
    realName: 'Orators — MC Bootcamp',
    tag: 'SIGNATURE',
    desc: 'Stage command, audience engagement, improvisation, microphone techniques, and crowd control. Own every room you walk into.',
    duration: '8 weeks',
    lessons: 24,
    color: '#FF3366',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
  },
  {
    id: '6',
    coolName: 'The Narrator',
    realName: 'Storyteller — TikTok Content for Events',
    tag: 'TRENDING',
    desc: 'Create compelling short-form videos for events, venues, and hospitality brands. Storytelling, editing, trends, and monetization strategies.',
    duration: '6 weeks',
    lessons: 20,
    color: '#CCFF00',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop',
  },
  {
    id: '7',
    coolName: 'The Lens',
    realName: 'Visual Storytelling — Photo & Video',
    tag: 'CREATIVE',
    desc: 'Photography and videography for compelling narratives. Composition, lighting, pre-production, editing, and portfolio development.',
    duration: '10 weeks',
    lessons: 32,
    color: '#7B61FF',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop',
  },
  {
    id: '8',
    coolName: 'The Selector',
    realName: 'DJ Arts & Music Industry',
    tag: 'SIGNATURE',
    desc: 'Mixing, scratching, beat-matching, set curation, music theory, audio engineering, and the business side of the music industry.',
    duration: '12 weeks',
    lessons: 36,
    color: '#FF6B35',
    image: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&h=400&fit=crop',
  },
];

const SparkPrograms = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <SEOHead
        title="Spark Programs — Micro-Credentials That Hit Different"
        description="8 industry-leading micro-credential programs in hospitality, events & tourism. Stack skills, earn certifications, build your career."
      />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100">
          <Link to="/spark" className="flex items-center gap-3">
            <img src={sparkLogo} alt="Spark" className="h-8 w-8" />
            <span className="text-sm font-extrabold tracking-[0.15em] uppercase text-gray-900">Spark</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-gray-500 font-semibold">
            <Link to="/spark" className="hover:text-[#65A300] transition-colors">Home</Link>
            <Link to="/spark/events" className="hover:text-[#65A300] transition-colors">Events</Link>
            <Link to="/spark/news" className="hover:text-[#65A300] transition-colors">News</Link>
            <Link to="/spark/media" className="hover:text-[#65A300] transition-colors">Media</Link>
          </div>
          <Link to="/spark" className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full hover:bg-[#B8E600] transition-colors shadow-sm">
            Back to Spark
          </Link>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-4 block">Micro-Credential Programs</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[0.95]">
            8 programs.<br />
            <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent">Zero fluff.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Each program is a stackable micro-credential — learn at your pace, earn real certifications, and build a career portfolio that speaks louder than any degree. <span className="text-gray-300">These are just a few of our programs — more are launching soon.</span>
          </p>
        </section>

        {/* Programs Grid */}
        <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => (
              <div
                key={p.id}
                className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl"
                style={{ minHeight: '380px' }}
                onMouseEnter={() => setHoveredId(p.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <img
                    src={p.image}
                    alt={p.coolName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold px-3 py-1 rounded-full border text-white/80" style={{ borderColor: p.color + '80', backgroundColor: p.color + '20' }}>
                      {p.tag}
                    </span>
                    <span className="text-[10px] text-white/40 tracking-wider">{p.duration} · {p.lessons} lessons</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-1 leading-tight">{p.coolName}</h2>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-3">{p.realName}</p>

                  <p className={`text-sm text-white/60 leading-relaxed max-w-md transition-all duration-500 ${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {p.desc}
                  </p>

                  <div className={`flex gap-3 mt-4 transition-all duration-500 ${hoveredId === p.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="text-[10px] tracking-[0.12em] uppercase font-extrabold px-5 py-2.5 rounded-full transition-colors" style={{ backgroundColor: p.color, color: p.color === '#CCFF00' ? '#1a1a1a' : '#fff' }}>
                      Enroll Now
                    </button>
                    <button className="text-[10px] tracking-[0.12em] uppercase font-bold px-5 py-2.5 rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition-colors">
                      Syllabus
                    </button>
                  </div>
                </div>

                {/* Number */}
                <div className="absolute top-6 right-6 text-6xl font-extrabold text-white/10 z-10">
                  0{p.id}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 text-center bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Can't decide?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Take our 2-minute quiz to find the perfect program for your goals, schedule, and vibe.</p>
          <button className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/25">
            Find My Program →
          </button>
        </section>
      </div>
    </>
  );
};

export default SparkPrograms;
