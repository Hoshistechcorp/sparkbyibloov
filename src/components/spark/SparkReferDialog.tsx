import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SparkReferDialogProps {
  open: boolean;
  onClose: () => void;
}

export const SparkReferDialog: React.FC<SparkReferDialogProps> = ({ open, onClose }) => {
  const [friendEmail, setFriendEmail] = useState('');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { data: programs = [] } = useQuery({
    queryKey: ['spark-programs-refer'],
    queryFn: async () => {
      const { data } = await supabase.from('spark_programs').select('id, cool_name, color').eq('published', true).order('sort_order', { ascending: true });
      return data || [];
    },
  });

  const toggleProgram = (id: string) => {
    setSelectedPrograms(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) {
      toast.error('Please enter your friend\'s email');
      return;
    }
    if (selectedPrograms.length === 0) {
      toast.error('Please select at least one program');
      return;
    }
    setSending(true);

    // Build referral link with program info
    const programNames = programs.filter((p: any) => selectedPrograms.includes(p.id)).map((p: any) => p.cool_name);
    const referralLink = `${window.location.origin}/spark/auth`;
    const text = `Hey! I think you'd love these Spark programs: ${programNames.join(', ')}. Sign up here: ${referralLink}`;

    try {
      // Copy to clipboard as fallback & share
      if (navigator.share) {
        await navigator.share({ title: 'Join Spark', text, url: referralLink }).catch(() => {});
      } else {
        await navigator.clipboard.writeText(text);
      }
      setSent(true);
      toast.success('Referral ready! Share it with your friend.');
    } catch {
      await navigator.clipboard.writeText(text).catch(() => {});
      setSent(true);
      toast.success('Referral link copied to clipboard!');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setFriendEmail('');
    setSelectedPrograms([]);
    setSent(false);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#ec9f00]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ec9f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Refer a Friend</h3>
              </div>
              <p className="text-sm text-gray-400 mb-5">Share Spark with a friend and recommend programs you think they'd love.</p>

              <form onSubmit={handleSend} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Friend's Email</label>
                  <input
                    type="email"
                    value={friendEmail}
                    onChange={e => setFriendEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors text-sm"
                    placeholder="friend@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Recommend Programs</label>
                  <div className="grid grid-cols-2 gap-2">
                    {programs.map((p: any) => {
                      const selected = selectedPrograms.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProgram(p.id)}
                          className={`relative text-left px-3 py-2.5 rounded-xl border-2 transition-all text-xs leading-snug font-medium ${
                            selected
                              ? 'border-[#ec9f00] bg-[#ec9f00]/10 text-gray-900 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {selected && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ec9f00] flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                          {p.cool_name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3.5 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {sending ? 'Preparing...' : 'Send Referral'}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Referral Sent! 🎉</h3>
              <p className="text-sm text-gray-400 mb-6">Your friend will love Spark. Share the referral link with them!</p>
              <button
                onClick={handleClose}
                className="text-sm font-bold text-[#ec9f00] hover:underline"
              >
                Done
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
