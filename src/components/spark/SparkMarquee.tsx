import React from 'react';
import { motion } from 'framer-motion';

const keywords = [
  'HOSPITALITY', 'EVENT PLANNING', 'MIXOLOGY', 'TOURISM', 'CONCIERGE', 'DJ ARTS',
  'PHOTOGRAPHY', 'MC BOOTCAMP', 'STORYTELLING', 'VISUAL MEDIA', 'BARTENDING',
  'TOUR GUIDING', 'CROWD MANAGEMENT', 'TIKTOK CONTENT', 'STAGE PRESENCE',
];

export const SparkMarquee = () => (
  <div className="relative py-6 border-y border-gray-100 overflow-hidden bg-gray-50">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex animate-scroll-left-fast whitespace-nowrap"
    >
      {[...keywords, ...keywords, ...keywords, ...keywords].map((word, i) => (
        <span key={i} className="text-[11px] tracking-[0.3em] uppercase text-gray-300 font-bold mx-6 flex items-center gap-6">
          {word}
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]"
          />
        </span>
      ))}
    </motion.div>
  </div>
);
