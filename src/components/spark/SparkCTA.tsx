import React from 'react';

export const SparkCTA = () => (
  <section className="py-32 px-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FFE8] to-white" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#CCFF00]/15 blur-[150px]" />
    
    <div className="relative z-10 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-gray-900">
        The industry is changing.<br />
        <span className="bg-gradient-to-r from-[#CCFF00] to-[#00C896] bg-clip-text text-transparent">Are you?</span>
      </h2>
      <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
        Join thousands of learners, hundreds of experts, and dozens of cities already building the future of hospitality and events with Spark.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button className="bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-[#B8E600] transition-all hover:scale-105 shadow-lg shadow-[#CCFF00]/25">
          Start Learning Free
        </button>
        <button className="border-2 border-gray-200 text-gray-600 font-bold text-sm tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-gray-50 transition-all">
          Talk to Our Team
        </button>
      </div>
    </div>
  </section>
);
