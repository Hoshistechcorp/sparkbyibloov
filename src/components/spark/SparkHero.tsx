import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import heroBaristas from '@/assets/hero/baristas.jpeg';
import heroBartender from '@/assets/hero/bartender.jpeg';
import heroChefPlating from '@/assets/hero/chef-plating.jpeg';
import heroChefsCooking from '@/assets/hero/chefs-cooking.jpeg';
import heroConcierge from '@/assets/hero/concierge.jpeg';
import heroDjPerforming from '@/assets/hero/dj-performing.jpeg';
import heroDjsMixing from '@/assets/hero/djs-mixing.jpeg';
import heroHotelReception from '@/assets/hero/hotel-reception.jpeg';

const images = [
  heroBaristas,
  heroBartender,
  heroChefPlating,
  heroChefsCooking,
  heroConcierge,
  heroDjPerforming,
  heroDjsMixing,
  heroHotelReception,
];

const gridCells = [
  { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
  { col: 3, row: 1, colSpan: 1, rowSpan: 1 },
  { col: 4, row: 1, colSpan: 1, rowSpan: 2 },
  { col: 5, row: 1, colSpan: 2, rowSpan: 1 },
  { col: 3, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 5, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 6, row: 2, colSpan: 1, rowSpan: 1 },
  { col: 1, row: 3, colSpan: 1, rowSpan: 1 },
  { col: 2, row: 3, colSpan: 2, rowSpan: 2 },
  { col: 4, row: 3, colSpan: 1, rowSpan: 1 },
  { col: 5, row: 3, colSpan: 2, rowSpan: 2 },
  { col: 1, row: 4, colSpan: 1, rowSpan: 1 },
];

export const SparkHero = () => {
  const [cellImages, setCellImages] = useState<number[]>(gridCells.map((_, i) => i % images.length));
  const [swappingCell, setSwappingCell] = useState<number | null>(null);

  const swapRandomCell = useCallback(() => {
    const cellIndex = Math.floor(Math.random() * gridCells.length);
    setSwappingCell(cellIndex);
    setCellImages(prev => {
      const usedImages = new Set(prev);
      const availableImages = images.map((_, i) => i).filter(i => !usedImages.has(i));
      let newImageIndex: number;
      if (availableImages.length > 0) {
        newImageIndex = availableImages[Math.floor(Math.random() * availableImages.length)];
      } else {
        do { newImageIndex = Math.floor(Math.random() * images.length); } while (newImageIndex === prev[cellIndex] && images.length > 1);
      }
      const next = [...prev];
      next[cellIndex] = newImageIndex;
      return next;
    });
    setTimeout(() => setSwappingCell(null), 800);
  }, []);

  useEffect(() => {
    const interval = setInterval(swapRandomCell, 2500);
    return () => clearInterval(interval);
  }, [swapRandomCell]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      <div className="absolute inset-0">
        <div className="w-full h-full grid gap-1 p-1 md:hidden" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(4, 1fr)' }}>
          {images.slice(0, 12).map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-lg">
              <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="w-full h-full hidden md:grid gap-2 p-2" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)' }}>
          {gridCells.map((cell, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl" style={{ gridColumn: `${cell.col} / span ${cell.colSpan}`, gridRow: `${cell.row} / span ${cell.rowSpan}` }}>
              <AnimatePresence mode="wait">
                <motion.img key={cellImages[i]} src={images[cellImages[i]]} alt="" className="absolute inset-0 w-full h-full object-cover"
                  initial={swappingCell === i ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-white/75" />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mb-6">
          <span className="text-[11px] tracking-[0.4em] uppercase text-[#c48500] font-bold">
            Micro-Credentials · Hospitality · Events · Tourism
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.7 }}
          className="text-3xl md:text-5xl lg:text-[5.5rem] font-black leading-[0.92] tracking-tight mb-6 md:mb-8 text-gray-900">
          Learn what<br />
          <span className="bg-gradient-to-r from-[#ec9f00] via-[#f0b840] to-[#00C896] bg-clip-text text-transparent">
            actually matters.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1 }}
          className="text-sm md:text-lg text-gray-700 font-medium max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
          World-class education meets real-world skills. Stackable credentials for the next generation of industry leaders.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Link to="/spark/auth">
            <motion.button whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(236,159,0,0.3)' }} whileTap={{ scale: 0.95 }}
              className="bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/20">
              Start Learning Free →
            </motion.button>
          </Link>
          <Link to="/spark/partners">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 text-gray-700 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-white/60 transition-all">
              Partner With Us
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
