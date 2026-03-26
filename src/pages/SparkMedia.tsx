import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkFooter } from '@/components/spark/SparkFooter';

const mediaItems = [
  { type: 'video' as const, title: 'Spark Launch Film', desc: 'See how Spark is changing the game for hospitality education across Africa.', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { type: 'image' as const, title: 'Event Planning Masterclass', desc: 'Behind the scenes of our flagship event planning program.', src: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=500&fit=crop' },
  { type: 'image' as const, title: 'Mixology in Action', desc: 'Our learners crafting cocktails during the bartending intensive.', src: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=500&fit=crop' },
  { type: 'video' as const, title: 'MC Bootcamp Highlights', desc: 'Watch our MCs own the stage at graduation showcase.', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { type: 'image' as const, title: 'DJ Arts Performance', desc: 'The Selector program graduates rocking a live set.', src: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop' },
  { type: 'image' as const, title: 'Visual Storytelling Workshop', desc: 'Lens program learners on location capturing stories.', src: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=500&fit=crop' },
  { type: 'image' as const, title: 'Tourism Expedition', desc: 'Da Plotter program learners guiding their first real tour.', src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=500&fit=crop' },
  { type: 'video' as const, title: 'TikTok Content Workshop', desc: 'Narrator program learners creating viral hospitality content.', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

const SparkMedia = () => {
  return (
    <>
      <SEOHead title="Spark Media — See the Journey" description="Photos, videos, and behind-the-scenes content from Spark by iBloov Learning programs." />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <SparkSubNav activeLink="media" />

        <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-4 md:px-12 max-w-7xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-4 block">Gallery</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900 leading-[0.95]">
            See the<br />
            <span className="bg-gradient-to-r from-[#ec9f00] via-[#f0b840] to-[#00C896] bg-clip-text text-transparent">journey.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-base md:text-lg text-gray-400 max-w-2xl">
            Photos, videos, and behind-the-scenes moments from our programs, events, and learner experiences.
          </motion.p>
        </section>

        <section className="px-4 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {mediaItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group rounded-2xl md:rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300">
                {item.type === 'video' ? (
                  <div className="aspect-video">
                    <iframe src={item.embed} title={item.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                ) : (
                  <div className="aspect-video overflow-hidden">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 md:px-6 text-center bg-gray-50">
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-4">Want to be featured?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join a Spark program and your story could be here next.</p>
          <Link to="/spark/programs" className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25">
            Explore Programs →
          </Link>
        </section>
        <SparkFooter />
      </div>
    </>
  );
};

export default SparkMedia;
