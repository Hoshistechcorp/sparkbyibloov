import React from 'react';
import sparkLogo from '@/assets/spark-logo.svg';

export const SparkHero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-white">
    {/* Soft gradient orbs */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#CCFF00]/20 blur-[150px]" />
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/10 blur-[120px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#7B61FF]/8 blur-[100px]" />

    <div className="relative z-10 text-center max-w-5xl mx-auto">
      <img src={sparkLogo} alt="Spark" className="h-20 w-20 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(204,255,0,0.4)]" />

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 text-gray-900">
        Learn what<br />
        <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent">
          actually matters.
        </span>
        <br />
        <span className="text-gray-300 text-3xl md:text-5xl lg:text-6xl font-light">Right now.</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
        Micro-credentials in hospitality, events & tourism — built for the next generation of industry leaders. World-class education meets real-world skills.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#B8E600] transition-all hover:scale-105 shadow-lg shadow-[#CCFF00]/25">
          Start Learning Free →
        </button>
        <button className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-50 transition-all">
          Partner With Us
        </button>
      </div>
    </div>
  </section>
);
