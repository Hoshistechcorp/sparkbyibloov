import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
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
        description="Spark by iBloov Learning combines world-class education with real-world hospitality, events & tourism skills. Micro-credentials for Gen Z, Gen Alpha, and industry leaders."
        keywords="spark, ibloov, learning, hospitality, events, tourism, micro-credentials, gen z, gen alpha"
      />
      <div className="bg-[#0A0A0A] text-white min-h-screen overflow-x-hidden font-sans">
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
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5">
    <div className="flex items-center gap-3">
      <img src={sparkLogo} alt="Spark" className="h-8 w-8" />
      <span className="text-sm font-semibold tracking-[0.2em] uppercase">Spark</span>
      <span className="text-[10px] text-white/40 tracking-wider uppercase ml-1">by iBloov</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.15em] uppercase text-white/60">
      <a href="#programs" className="hover:text-white transition-colors">Programs</a>
      <a href="#audiences" className="hover:text-white transition-colors">For You</a>
      <a href="#partners" className="hover:text-white transition-colors">Partners</a>
      <a href="#dna" className="hover:text-white transition-colors">Why Spark</a>
    </div>
    <button className="bg-[#CCFF00] text-black text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#B8E600] transition-colors">
      Get Started
    </button>
  </nav>
);

export default Spark;
