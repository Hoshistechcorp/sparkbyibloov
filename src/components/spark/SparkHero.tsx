import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506869640319-fe1a24fd76cb?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=600&fit=crop&q=80',
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
  const [cellImages, setCellImages] = useState<number[]>(
    gridCells.map((_, i) => i % images.length)
  );
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
      {/* Full-bleed image mosaic grid */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full grid gap-2 p-2"
          style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
          }}
        >
          {gridCells.map((cell, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl"
              style={{
                gridColumn: `${cell.col} / span ${cell.colSpan}`,
                gridRow: `${cell.row} / span ${cell.rowSpan}`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={cellImages[i]}
                  src={images[cellImages[i]]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={swappingCell === i ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                />
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Light frosted overlay for text readability */}
      <div className="absolute inset-0 bg-white/55" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6"
        >
          <span className="text-[11px] tracking-[0.4em] uppercase text-[#65A300] font-bold">
            Micro-Credentials · Hospitality · Events · Tourism
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold leading-[0.92] tracking-tight mb-8 text-gray-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
        >
          Learn what<br />
          <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent">
            actually matters.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]"
        >
          World-class education meets real-world skills. Stackable credentials for the next generation of industry leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(204,255,0,0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/20"
          >
            Start Learning Free →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white/30 text-white/80 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-white/10 transition-all"
          >
            Partner With Us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
