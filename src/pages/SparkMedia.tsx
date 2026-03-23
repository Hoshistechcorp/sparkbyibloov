import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { Link } from 'react-router-dom';

const mediaItems = [
  {
    type: 'video' as const,
    title: 'Spark Launch Film',
    desc: 'See how Spark is changing the game for hospitality education across Africa.',
    embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    aspect: 'video',
  },
  {
    type: 'image' as const,
    title: 'Event Planning Masterclass',
    desc: 'Behind the scenes of our flagship event planning program.',
    src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop',
  },
  {
    type: 'image' as const,
    title: 'Mixology in Action',
    desc: 'Our learners crafting cocktails during the bartending intensive.',
    src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=500&fit=crop',
  },
  {
    type: 'video' as const,
    title: 'MC Bootcamp Highlights',
    desc: 'Watch our MCs own the stage at graduation showcase.',
    embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    aspect: 'video',
  },
  {
    type: 'image' as const,
    title: 'DJ Arts Performance',
    desc: 'The Selector program graduates rocking a live set.',
    src: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop',
  },
  {
    type: 'image' as const,
    title: 'Visual Storytelling Workshop',
    desc: 'Lens program learners on location capturing stories.',
    src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=500&fit=crop',
  },
  {
    type: 'image' as const,
    title: 'Tourism Expedition',
    desc: 'Da Plotter program learners guiding their first real tour.',
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop',
  },
  {
    type: 'video' as const,
    title: 'TikTok Content Workshop',
    desc: 'Narrator program learners creating viral hospitality content.',
    embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    aspect: 'video',
  },
];

const SparkMedia = () => {
  return (
    <>
      <SEOHead
        title="Spark Media — See the Journey"
        description="Photos, videos, and behind-the-scenes content from Spark by iBloov Learning programs."
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
            <Link to="/spark/programs" className="hover:text-[#65A300] transition-colors">Programs</Link>
          </div>
          <Link to="/spark" className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full hover:bg-[#B8E600] transition-colors shadow-sm">
            Back to Spark
          </Link>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-4 block">Gallery</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[0.95]">
            See the<br />
            <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent">journey.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Photos, videos, and behind-the-scenes moments from our programs, events, and learner experiences.
          </p>
        </section>

        {/* Media Grid */}
        <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaItems.map((item, i) => (
              <div key={i} className="group rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300">
                {item.type === 'video' ? (
                  <div className="aspect-video">
                    <iframe
                      src={item.embed}
                      title={item.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Want to be featured?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join a Spark program and your story could be here next.</p>
          <Link to="/spark/programs" className="inline-block bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/25">
            Explore Programs →
          </Link>
        </section>
      </div>
    </>
  );
};

export default SparkMedia;
