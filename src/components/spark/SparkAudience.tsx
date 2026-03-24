import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const audiences = [
  {
    id: 'learners',
    label: 'Learners',
    tagline: 'Skip the boring. Learn by doing.',
    people: [
      { name: 'Amara Osei', role: 'Event Coordinator, Accra', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop', quote: 'Spark gave me skills my degree never did.' },
      { name: 'Jabari Mensah', role: 'Freelance MC & Host', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', quote: 'I booked 3 gigs within a month of completing The Voice.' },
      { name: 'Nia Abrams', role: 'Content Creator', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', quote: 'The Narrator program changed how I shoot events forever.' },
      { name: 'Kwesi Appiah', role: 'Bartender & Mixologist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', quote: 'From amateur to head bartender in 10 weeks.' },
    ],
  },
  {
    id: 'partners',
    label: 'Training Partners',
    tagline: 'Scale your impact. We handle the platform.',
    people: [
      { name: 'Dr. Fatima Diallo', role: 'Dean, West African Hospitality Institute', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop', quote: 'Spark lets us reach students we never could before.' },
      { name: 'Michael Okonkwo', role: 'CEO, Lagos Events Group', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop', quote: 'Our staff upskilling costs dropped 60% with Spark.' },
      { name: 'Sarah Chen', role: 'Director, Pan-African Tourism Board', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop', quote: 'FIFA readiness training across 12 cities — seamless.' },
      { name: 'James Kariuki', role: 'VP Training, Serena Hotels', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', quote: 'Custom upskilling tracks that actually match our needs.' },
    ],
  },
  {
    id: 'experts',
    label: 'Leading Experts',
    tagline: 'Your knowledge deserves a bigger stage.',
    people: [
      { name: 'DJ Spinall', role: 'Grammy-Nominated DJ & Producer', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', quote: 'Teaching the next generation of selectors is my legacy.' },
      { name: 'Chef Zola Nene', role: 'Celebrity Chef & TV Host', image: 'https://images.unsplash.com/photo-1595257841889-eca2678571c0?w=400&h=400&fit=crop', quote: 'Spark lets me reach aspiring chefs across the continent.' },
      { name: 'Aisha Mohammed', role: 'Award-winning Photographer', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', quote: 'My visual storytelling course has 2,000+ enrolled learners.' },
      { name: 'Tunde Ednut', role: 'MC & Entertainment Mogul', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', quote: 'Record once, impact thousands. That\'s the Spark model.' },
    ],
  },
];

export const SparkAudience = () => {
  const [active, setActive] = useState('learners');
  const current = audiences.find((a) => a.id === active)!;

  return (
    <section id="audiences" className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-3 block">Built for everyone</span>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">Who is Spark for?</h2>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-10">
        {audiences.map((a) => (
          <motion.button
            key={a.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(a.id)}
            className={`text-[12px] tracking-[0.1em] uppercase px-5 py-2.5 rounded-full font-bold transition-all ${
              active === a.id
                ? 'bg-[#CCFF00] text-gray-900 shadow-md shadow-[#CCFF00]/20'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {a.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xl md:text-3xl font-light text-gray-400 mb-8 md:mb-10">{current.tagline}</p>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {current.people.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#CCFF00]/10 transition-all cursor-pointer"
              >
                <div className="relative h-36 md:h-52 overflow-hidden">
                  <motion.img
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-xs md:text-sm">{person.name}</h3>
                    <p className="text-white/60 text-[10px] md:text-[11px] truncate">{person.role}</p>
                  </div>
                </div>
                <div className="p-3 md:p-5">
                  <p className="text-xs md:text-sm text-gray-500 leading-relaxed italic">"{person.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
