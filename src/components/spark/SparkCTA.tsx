import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const SparkCTA = () => (
  <section className="py-20 md:py-32 px-4 md:px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFF8E8] to-white" />
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ec9f00]/15 blur-[150px]"
    />
    
    <div className="relative z-10 max-w-3xl mx-auto">
      <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
        className="text-3xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 text-gray-900">
        The industry is changing.<br />
        <span className="bg-gradient-to-r from-[#ec9f00] to-[#00C896] bg-clip-text text-transparent">Are you?</span>
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base md:text-lg text-gray-400 mb-8 md:mb-10 max-w-xl mx-auto">
        Join thousands of learners, hundreds of experts, and dozens of cities already building the future of hospitality and events with Spark.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <Link to="/spark/auth">
          <motion.button whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(236,159,0,0.4)' }} whileTap={{ scale: 0.95 }}
            className="bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25">
            Start Learning Free
          </motion.button>
        </Link>
        <Link to="/spark/partners">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-gray-50 transition-all">
            Talk to Our Team
          </motion.button>
        </Link>
      </motion.div>
    </div>
  </section>
);
