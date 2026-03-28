import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparkSponsorDialog } from './SparkSponsorDialog';

export const SparkScholarship = () => {
  const [sponsorOpen, setSponsorOpen] = useState(false);

  return (
    <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-gray-900" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#ec9f00]/10 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#00C896]/10 blur-[120px]"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#ec9f00] font-bold mb-3 block"
          >
            Scholarships
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Light a{' '}
            <span className="bg-gradient-to-r from-[#ec9f00] via-[#f59e0b] to-[#00C896] bg-clip-text text-transparent">
              Spark
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            Education should never be out of reach. Fund a dream, sponsor a learner, or power a scholarship — and help shape the next generation of industry leaders.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Option 1: Light a Spark Fund */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 hover:border-[#ec9f00]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec9f00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ec9f00] to-[#f59e0b] flex items-center justify-center mb-6 shadow-lg shadow-[#ec9f00]/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">Light a Spark Fund</h3>
              <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">
                Contribute to our open scholarship pool. Every donation directly funds a learner's journey through a Spark program — no strings attached.
              </p>
              <motion.a
                href="https://forms.gle/fkqsJ9qLvT5wHnTf6"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ec9f00] to-[#f59e0b] text-white font-bold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded-full shadow-lg shadow-[#ec9f00]/25 hover:shadow-[#ec9f00]/40 transition-shadow"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Donate Now
              </motion.a>
            </div>
          </motion.div>

          {/* Option 2: Sponsor Your Orbit */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-10 hover:border-[#00C896]/40 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00C896]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00C896] to-[#10b981] flex items-center justify-center mb-6 shadow-lg shadow-[#00C896]/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">Sponsor Your Orbit</h3>
              <p className="text-gray-400 text-sm md:text-base mb-6 leading-relaxed">
                Design your own scholarship. Choose the location, programs, and number of learners you want to empower — and see your impact in real-time.
              </p>
              <motion.button
                onClick={() => setSponsorOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00C896] to-[#10b981] text-white font-bold text-sm tracking-[0.06em] uppercase px-6 py-3 rounded-full shadow-lg shadow-[#00C896]/25 hover:shadow-[#00C896]/40 transition-shadow"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Design Your Scholarship
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <SparkSponsorDialog open={sponsorOpen} onClose={() => setSponsorOpen(false)} />
    </section>
  );
};
