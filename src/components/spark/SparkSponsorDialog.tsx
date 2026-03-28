import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface SparkSponsorDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SparkSponsorDialog = ({ open, onClose }: SparkSponsorDialogProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ['spark-programs-sponsor'],
    queryFn: async () => {
      const { data } = await supabase
        .from('spark_programs')
        .select('id, cool_name, real_name, price, color, description')
        .eq('published', true)
        .order('sort_order');
      return data || [];
    },
  });

  const toggleProgram = (id: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
    if (!studentCounts[id]) {
      setStudentCounts((prev) => ({ ...prev, [id]: 1 }));
    }
  };

  const updateCount = (id: string, count: number) => {
    setStudentCounts((prev) => ({ ...prev, [id]: Math.max(1, count) }));
  };

  const totalAmount = selectedPrograms.reduce((sum, id) => {
    const prog = programs.find((p) => p.id === id);
    return sum + (prog?.price || 0) * (studentCounts[id] || 1);
  }, 0);

  const totalStudents = selectedPrograms.reduce(
    (sum, id) => sum + (studentCounts[id] || 1),
    0
  );

  const canProceedStep1 = email.trim().length > 0 && location.trim().length > 0;
  const canProceedStep2 = selectedPrograms.length > 0;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setName('');
    setEmail('');
    setLocation('');
    setSelectedPrograms([]);
    setStudentCounts({});
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#0f0f12]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white">Sponsor Your Orbit</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {submitted ? 'Thank you!' : `Step ${step} of 3`}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00C896] to-[#10b981] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00C896]/30">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">
                    You're a{' '}
                    <span className="bg-gradient-to-r from-[#ec9f00] to-[#00C896] bg-clip-text text-transparent">
                      game changer
                    </span>
                    !
                  </h3>
                  <p className="text-gray-400 text-sm max-w-md mx-auto mb-2">
                    Your scholarship will fund <strong className="text-white">{totalStudents} learner{totalStudents !== 1 ? 's' : ''}</strong> across{' '}
                    <strong className="text-white">{selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''}</strong>.
                  </p>
                  <p className="text-2xl font-extrabold text-[#00C896] mb-6">
                    ${totalAmount.toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs mb-6">Our team will reach out to you at <strong className="text-gray-300">{email}</strong> with next steps.</p>
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 text-white font-bold text-sm px-8 py-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    Close
                  </motion.button>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold mb-2 block">
                      Your Name <span className="text-gray-600">(optional)</span>
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#00C896]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold mb-2 block">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#00C896]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold mb-2 block">
                      Sponsor learners from <span className="text-red-400">*</span>
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#00C896]/50"
                    />
                    <p className="text-gray-600 text-xs mt-1.5">Where should we find learners for your scholarship?</p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <motion.button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1}
                      whileHover={canProceedStep1 ? { scale: 1.05 } : {}}
                      whileTap={canProceedStep1 ? { scale: 0.95 } : {}}
                      className="bg-gradient-to-r from-[#00C896] to-[#10b981] text-white font-bold text-sm px-8 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00C896]/20"
                    >
                      Choose Programs →
                    </motion.button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <p className="text-gray-400 text-sm mb-1">Select the program(s) you'd like to sponsor:</p>
                  <div className="space-y-3">
                    {programs.map((prog) => {
                      const selected = selectedPrograms.includes(prog.id);
                      return (
                        <motion.div
                          key={prog.id}
                          layout
                          className={`rounded-xl border p-4 cursor-pointer transition-all duration-300 ${
                            selected
                              ? 'border-[#00C896]/50 bg-[#00C896]/5'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                          onClick={() => toggleProgram(prog.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: prog.color }}
                                />
                                <span className="font-extrabold text-white text-sm">{prog.cool_name}</span>
                              </div>
                              <p className="text-gray-500 text-xs">{prog.real_name}</p>
                              {prog.description && (
                                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{prog.description}</p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-white font-extrabold text-lg">${Number(prog.price).toLocaleString()}</span>
                              <p className="text-gray-600 text-[10px]">per student</p>
                            </div>
                          </div>

                          {/* Student count selector */}
                          <AnimatePresence>
                            {selected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                  <span className="text-gray-400 text-xs font-medium">Number of students</span>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateCount(prog.id, (studentCounts[prog.id] || 1) - 1);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center font-bold"
                                    >
                                      −
                                    </button>
                                    <span className="text-white font-extrabold text-lg w-8 text-center">
                                      {studentCounts[prog.id] || 1}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateCount(prog.id, (studentCounts[prog.id] || 1) + 1);
                                      }}
                                      className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center font-bold"
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="text-[#00C896] font-bold text-sm min-w-[60px] text-right">
                                    ${(Number(prog.price) * (studentCounts[prog.id] || 1)).toLocaleString()}
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <motion.button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      whileHover={canProceedStep2 ? { scale: 1.05 } : {}}
                      whileTap={canProceedStep2 ? { scale: 0.95 } : {}}
                      className="bg-gradient-to-r from-[#00C896] to-[#10b981] text-white font-bold text-sm px-8 py-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#00C896]/20"
                    >
                      Review Summary →
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Sponsor info */}
                  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold mb-2">Sponsor Details</p>
                    {name && <p className="text-white text-sm font-medium">{name}</p>}
                    <p className="text-gray-400 text-sm">{email}</p>
                    <p className="text-gray-500 text-xs mt-1">Learners from: <span className="text-gray-300">{location}</span></p>
                  </div>

                  {/* Selected programs breakdown */}
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 font-bold mb-3">Scholarship Breakdown</p>
                    <div className="space-y-2">
                      {selectedPrograms.map((id) => {
                        const prog = programs.find((p) => p.id === id);
                        if (!prog) return null;
                        const count = studentCounts[id] || 1;
                        const subtotal = Number(prog.price) * count;
                        return (
                          <div key={id} className="flex items-center justify-between py-2 border-b border-white/5">
                            <div>
                              <span className="text-white text-sm font-bold">{prog.cool_name}</span>
                              <span className="text-gray-600 text-xs ml-2">
                                {count} student{count !== 1 ? 's' : ''} × ${Number(prog.price).toLocaleString()}
                              </span>
                            </div>
                            <span className="text-white font-bold">${subtotal.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="rounded-xl bg-gradient-to-r from-[#00C896]/10 to-[#10b981]/10 border border-[#00C896]/20 p-5 text-center">
                    <p className="text-gray-400 text-xs mb-1">Total Scholarship Amount</p>
                    <p className="text-4xl font-extrabold text-[#00C896]">${totalAmount.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {totalStudents} learner{totalStudents !== 1 ? 's' : ''} across {selectedPrograms.length} program{selectedPrograms.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                    >
                      ← Back
                    </button>
                    <motion.button
                      onClick={handleSubmit}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#00C896] to-[#10b981] text-white font-extrabold text-sm tracking-[0.06em] uppercase px-8 py-3 rounded-full shadow-lg shadow-[#00C896]/25"
                    >
                      Confirm Scholarship ✨
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
