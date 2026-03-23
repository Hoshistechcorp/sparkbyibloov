import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { SparkHero } from '@/components/spark/SparkHero';
import { SparkMarquee } from '@/components/spark/SparkMarquee';
import { SparkAudience } from '@/components/spark/SparkAudience';
import { SparkDNA } from '@/components/spark/SparkDNA';
import { SparkPartners } from '@/components/spark/SparkPartners';
import { SparkCTA } from '@/components/spark/SparkCTA';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Spark = () => {
  return (
    <>
      <SEOHead
        title="Spark — Learn What Actually Matters"
        description="Spark by iBloov Learning combines world-class education with real-world hospitality, events & tourism skills. Micro-credentials for the next generation of industry leaders."
        keywords="spark, ibloov, learning, hospitality, events, tourism, micro-credentials"
      />
      <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden font-[Nunito]">
        <SparkNav />
        <SparkHero />
        <SparkMarquee />

        {/* Programs teaser */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block"
          >
            Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4"
          >
            8 programs. Zero fluff.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-xl mx-auto mb-8"
          >
            Stackable micro-credentials in hospitality, events & tourism. Each one designed to be your unfair advantage.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/spark/programs"
              className="inline-block bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/25 hover:scale-105"
            >
              Explore All Programs →
            </Link>
          </motion.div>
        </section>

        <SparkAudience />
        <SparkDNA />
        <SparkPartners />
        <SparkCTA />
        <SparkFooter />
      </div>
    </>
  );
};

const SparkNav = () => (
  <motion.nav
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100"
  >
    <div className="flex items-center gap-3">
      <img src={sparkLogo} alt="Spark" className="h-10 w-10" />
      <span className="text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-gray-500 font-semibold">
      <Link to="/spark/programs" className="hover:text-[#65A300] transition-colors">Programs</Link>
      <Link to="/spark/events" className="hover:text-[#65A300] transition-colors">Events</Link>
      <a href="#audiences" className="hover:text-[#65A300] transition-colors">For You</a>
      <Link to="/spark/news" className="hover:text-[#65A300] transition-colors">News</Link>
      <Link to="/spark/media" className="hover:text-[#65A300] transition-colors">Media</Link>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full hover:bg-[#B8E600] transition-colors shadow-sm"
    >
      Get Started
    </motion.button>
  </motion.nav>
);

export default Spark;
