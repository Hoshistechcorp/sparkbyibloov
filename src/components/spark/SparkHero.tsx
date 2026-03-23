import React from 'react';
import sparkLogo from '@/assets/spark-logo.svg';
import { motion } from 'framer-motion';

export const SparkHero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-white">
    {/* Animated gradient orbs */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#CCFF00]/20 blur-[150px]"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/10 blur-[120px]"
    />
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#7B61FF]/10 blur-[100px]"
    />

    <div className="relative z-10 text-center max-w-5xl mx-auto">
      <motion.img
        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        src={sparkLogo}
        alt="Spark"
        className="h-20 w-20 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(204,255,0,0.4)]"
      />

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 text-gray-900"
      >
        Learn what<br />
        <motion.span
          initial={{ backgroundSize: '0% 100%' }}
          animate={{ backgroundSize: '100% 100%' }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent"
        >
          actually matters.
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-gray-300 text-3xl md:text-5xl lg:text-6xl font-light"
        >
          Right now.
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Micro-credentials in hospitality, events & tourism — built for the next generation of industry leaders. World-class education meets real-world skills.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="flex flex-col sm:flex-row items-center gap-4 justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(204,255,0,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/25"
        >
          Start Learning Free →
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-50 transition-all"
        >
          Partner With Us
        </motion.button>
      </motion.div>
    </div>

    {/* Floating particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.sin(i) * 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.5,
        }}
        className="absolute w-2 h-2 rounded-full bg-[#CCFF00]/40"
        style={{
          top: `${20 + (i * 12)}%`,
          left: `${10 + (i * 15)}%`,
        }}
      />
    ))}
  </section>
);
