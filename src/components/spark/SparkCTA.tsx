import React from 'react';

export const SparkCTA = () => (
  <section className="py-32 px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0F1A00] to-[#0A0A0A]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#CCFF00]/5 blur-[150px]" />
    
    <div className="relative z-10 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        The industry is changing.<br />
        <span className="bg-gradient-to-r from-[#CCFF00] to-[#00FFB2] bg-clip-text text-transparent">Are you?</span>
      </h2>
      <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto">
        Join thousands of learners, hundreds of experts, and dozens of cities already building the future of hospitality and events with Spark.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button className="bg-[#CCFF00] text-black font-bold text-sm tracking-[0.1em] uppercase px-10 py-4 hover:bg-[#B8E600] transition-all hover:scale-105">
          Start Learning Free
        </button>
        <button className="border border-white/20 text-white/80 text-sm tracking-[0.1em] uppercase px-10 py-4 hover:bg-white/5 transition-all">
          Talk to Our Team
        </button>
      </div>
    </div>
  </section>
);
