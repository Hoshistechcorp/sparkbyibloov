import React from 'react';
import sparkLogo from '@/assets/spark-logo.svg';

export const SparkHero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
    {/* Animated orbs */}
    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#CCFF00]/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF6B35]/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#7B61FF]/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

    <div className="relative z-10 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
        <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
        <span className="text-[11px] tracking-[0.2em] uppercase text-white/70">A product of iBloov</span>
      </div>

      <img src={sparkLogo} alt="Spark" className="h-20 w-20 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(204,255,0,0.3)]" />

      <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6">
        Learn what<br />
        <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00FFB2] bg-clip-text text-transparent">
          actually matters.
        </span>
        <br />
        <span className="text-white/40 text-3xl md:text-5xl lg:text-6xl font-light">Right now.</span>
      </h1>

      <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
        Micro-credentials in hospitality, events & tourism — built for the next generation of industry leaders. World-class education meets real-world skills.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
        <button className="bg-[#CCFF00] text-black font-bold text-sm tracking-[0.1em] uppercase px-8 py-4 hover:bg-[#B8E600] transition-all hover:scale-105">
          Start Learning Free →
        </button>
        <button className="border border-white/20 text-white/80 text-sm tracking-[0.1em] uppercase px-8 py-4 hover:bg-white/5 transition-all">
          Partner With Us
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
        {[
          { num: '50K+', label: 'Learners' },
          { num: '120+', label: 'Experts' },
          { num: '40+', label: 'Cities' },
          { num: '16', label: 'FIFA Host Cities' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#CCFF00]">{s.num}</div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-white/40 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
