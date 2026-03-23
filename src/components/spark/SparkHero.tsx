import React from 'react';
import { motion } from 'framer-motion';

const bgImages = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1506869640319-fe1a24fd76cb?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop&q=60',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop&q=60',
];

export const SparkHero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-white">
    {/* Background image mosaic - watermark style */}
    <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 gap-1 p-1 opacity-[0.08]">
      {bgImages.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: i * 0.15, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl"
        >
          <motion.img
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            src={src}
            alt=""
            className="w-full h-full object-cover grayscale"
            loading="eager"
          />
        </motion.div>
      ))}
    </div>

    {/* Soft overlay to ensure text readability */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />

    {/* Animated gradient orbs */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#CCFF00]/25 blur-[150px]"
    />
    <motion.div
      animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/12 blur-[120px]"
    />

    <div className="relative z-10 text-center max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 text-gray-900"
      >
        Learn what<br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent"
        >
          actually matters.
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
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
