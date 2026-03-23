import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { SparkHero } from '@/components/spark/SparkHero';
import { SparkMarquee } from '@/components/spark/SparkMarquee';
import { SparkAudience } from '@/components/spark/SparkAudience';
import { SparkPrograms } from '@/components/spark/SparkPrograms';
import { SparkDNA } from '@/components/spark/SparkDNA';
import { SparkPartners } from '@/components/spark/SparkPartners';
import { SparkCTA } from '@/components/spark/SparkCTA';
import { SparkFooter } from '@/components/spark/SparkFooter';

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
        <SparkAudience />
        <SparkPrograms />
        <SparkDNA />
        <SparkPartners />
        <SparkCTA />
        <SparkFooter />
      </div>
    </>
  );
};

const SparkNav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100">
    <div className="flex items-center gap-3">
      <img src={sparkLogo} alt="Spark" className="h-8 w-8" />
      <span className="text-sm font-extrabold tracking-[0.15em] uppercase text-gray-900">Spark</span>
      <span className="text-[10px] text-gray-400 tracking-wider uppercase ml-1">by iBloov</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-gray-500 font-semibold">
      <a href="#programs" className="hover:text-[#65A300] transition-colors">Programs</a>
      <a href="#audiences" className="hover:text-[#65A300] transition-colors">For You</a>
      <a href="#partners" className="hover:text-[#65A300] transition-colors">Partners</a>
      <a href="#dna" className="hover:text-[#65A300] transition-colors">Why Spark</a>
    </div>
    <button className="bg-[#CCFF00] text-gray-900 text-[11px] font-extrabold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full hover:bg-[#B8E600] transition-colors shadow-sm">
      Get Started
    </button>
  </nav>
);

export default Spark;
