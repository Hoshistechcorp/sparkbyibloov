import React from 'react';

const keywords = [
  'HOSPITALITY', 'EVENT PLANNING', 'MIXOLOGY', 'TOURISM', 'CONCIERGE', 'DJ ARTS',
  'PHOTOGRAPHY', 'MC BOOTCAMP', 'STORYTELLING', 'VISUAL MEDIA', 'BARTENDING',
  'TOUR GUIDING', 'CROWD MANAGEMENT', 'TIKTOK CONTENT', 'STAGE PRESENCE',
];

export const SparkMarquee = () => (
  <div className="relative py-6 border-y border-white/5 overflow-hidden bg-[#0A0A0A]">
    <div className="flex animate-scroll-left-fast whitespace-nowrap">
      {[...keywords, ...keywords, ...keywords, ...keywords].map((word, i) => (
        <span key={i} className="text-[11px] tracking-[0.3em] uppercase text-white/20 mx-6 flex items-center gap-6">
          {word}
          <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]/30" />
        </span>
      ))}
    </div>
  </div>
);
