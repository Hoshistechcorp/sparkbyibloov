import React from 'react';
import { motion } from 'framer-motion';

const pillars = [
  { source: 'Coursera', quality: 'Scale & Accessibility', desc: 'World-class content available to anyone, anywhere. No gatekeeping — just pure, democratized learning at scale.', accent: '#CCFF00' },
  { source: 'Guild', quality: 'Employer Alignment', desc: 'Every program maps to real employer needs. Tuition support, career pathways, and outcomes that matter to hiring managers.', accent: '#7B61FF' },
  { source: 'Yellowbrick', quality: 'Industry Production', desc: 'Celebrity instructors, immersive video, and brand-name partnerships that make learning feel premium and aspirational.', accent: '#FF6B35' },
  { source: 'Harvard Online', quality: 'Academic Rigor', desc: 'Research-backed curriculum, peer-reviewed content, and credentials that carry weight in any boardroom.', accent: '#00C896' },
];

export const SparkDNA = () => (
  <section id="dna" className="py-16 md:py-24 px-4 md:px-12 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block">Platform DNA</span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
          Four giants.<br />
          <span className="text-gray-300">One Spark.</span>
        </h2>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl">We studied what makes the world's best learning platforms great — then built something purpose-made for hospitality, events & tourism.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.source}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -15px rgba(0,0,0,0.08)' }}
            className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#CCFF00]/40 transition-all group cursor-pointer relative overflow-hidden"
          >
            {/* Accent line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '60px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="h-1 rounded-full mb-6"
              style={{ backgroundColor: p.accent }}
            />
            <div className="text-[10px] tracking-[0.2em] uppercase text-gray-300 font-bold mb-1">Inspired by {p.source}</div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-[#65A300] transition-colors text-gray-900">{p.quality}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
