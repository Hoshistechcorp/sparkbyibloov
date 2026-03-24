import React from 'react';
import { motion } from 'framer-motion';

const partnerTypes = [
  { type: 'Academic Partners', desc: 'Universities, colleges, and training institutes — co-develop curriculum and offer accredited micro-credentials.', benefits: ['Co-branded certificates', 'Revenue share model', 'Curriculum co-development'], accent: '#7B61FF' },
  { type: 'Employer Partners', desc: 'Hotels, event companies, tourism boards — sponsor learners, access pre-vetted talent, and upskill your workforce.', benefits: ['Talent pipeline access', 'Custom upskilling tracks', 'Workforce analytics'], accent: '#65A300' },
  { type: 'Icon Partners', desc: 'Celebrity chefs, renowned DJs, top photographers — teach what you know, earn while you impact.', benefits: ['Personal brand amplification', 'Passive income stream', 'Global audience reach'], accent: '#FF6B35' },
  { type: 'Municipal Partners', desc: 'City governments, FIFA host cities, tourism authorities — train your citizens for the opportunities coming to your city.', benefits: ['City-wide training rollout', 'FIFA readiness programs', 'Youth employment pipeline'], accent: '#00C896' },
];

export const SparkPartners = () => (
  <section id="partners" className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block">Partnerships</span>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">Build with us.</h2>
      <p className="text-lg text-gray-400 max-w-2xl">Spark is an ecosystem, not just a platform. We partner with institutions, employers, icons, and cities to create real impact.</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {partnerTypes.map((p, i) => (
        <motion.div
          key={p.type}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          whileHover={{ y: -6 }}
          className="bg-white border border-gray-100 p-8 rounded-2xl flex flex-col hover:border-gray-200 transition-all group hover:shadow-xl cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, type: 'spring' }}
            className="w-3 h-3 rounded-full mb-4"
            style={{ backgroundColor: p.accent }}
          />
          <h3 className="text-xl font-bold mb-2 text-gray-900">{p.type}</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">{p.desc}</p>
          <ul className="space-y-2 mb-8 flex-1">
            {p.benefits.map((b, bi) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + bi * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                {b}
              </motion.li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-[11px] tracking-[0.12em] uppercase font-extrabold px-5 py-3 rounded-full border-2 transition-all w-full text-center hover:text-white"
            style={{ borderColor: p.accent, color: p.accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = p.accent; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = p.accent; }}
          >
            Learn More
          </motion.button>
        </motion.div>
      ))}
    </div>
  </section>
);
