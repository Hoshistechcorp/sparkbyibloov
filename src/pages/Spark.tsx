import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { SparkSubNav } from '@/components/spark/SparkSubNav';
import { SparkHero } from '@/components/spark/SparkHero';
import { SparkMarquee } from '@/components/spark/SparkMarquee';
import { SparkAudience } from '@/components/spark/SparkAudience';
import { SparkDNA } from '@/components/spark/SparkDNA';
import { SparkPartners } from '@/components/spark/SparkPartners';
import { SparkScholarship } from '@/components/spark/SparkScholarship';
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
        <SparkSubNav activeLink="home" />
        <SparkHero />
        <SparkMarquee />

        {/* Programs teaser */}
        <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto text-center">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-3 block">
            Programs
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            <span className="text-[#ec9f00]">Spark Programs.</span>{' '}
            <span className="text-gray-900">Zero fluff.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-6 md:mb-8">
            Stackable micro-credentials in hospitality, events & tourism. Each one designed to be your unfair advantage.
          </motion.p>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Link to="/spark/programs"
              className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-sm hover:scale-105">
              Explore All Programs →
            </Link>
          </motion.div>
        </section>

        <SparkAudience />
        <SparkDNA />
        <SparkPartners />
        <SparkScholarship />
        <SparkCTA />
        <SparkFooter />
      </div>
    </>
  );
};

export default Spark;
