import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SparkInterestDialogProps {
  open: boolean;
  onClose: () => void;
  programId: string;
  programName: string;
  programColor?: string;
  defaultName?: string;
  defaultEmail?: string;
  userId?: string | null;
}

export const SparkInterestDialog: React.FC<SparkInterestDialogProps> = ({
  open, onClose, programId, programName, programColor = '#ec9f00', defaultName = '', defaultEmail = '', userId,
}) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim(); const em = email.trim(); const loc = location.trim();
    if (!n || !em || !loc) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (n.length > 100 || em.length > 255 || loc.length > 200) {
      toast.error('Please shorten your entries.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    const { error } = await (supabase as any).from('program_interest').insert({
      program_id: programId,
      user_id: userId ?? null,
      name: n,
      email: em,
      location: loc,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Could not submit. Please try again.');
      return;
    }
    setSent(true);
    toast.success("You're on the list! We'll be in touch.");
  };

  const handleClose = () => {
    setSent(false);
    setLocation('');
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl md:rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

          {!sent ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: programColor + '15' }}>
                  <svg className="w-5 h-5" style={{ color: programColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Join the Waitlist</h3>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                <span className="font-semibold text-gray-700">{programName}</span> is launching soon. Drop your details and we'll notify you as soon as lessons go live.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)} required maxLength={100}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    style={{ borderColor: undefined }}
                    onFocus={e => (e.currentTarget.style.borderColor = programColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = '')}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    onFocus={e => (e.currentTarget.style.borderColor = programColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = '')}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Location</label>
                  <input
                    type="text" value={location} onChange={e => setLocation(e.target.value)} required maxLength={200}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none transition-colors text-sm"
                    onFocus={e => (e.currentTarget.style.borderColor = programColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = '')}
                    placeholder="City, Country"
                  />
                </div>

                <motion.button
                  type="submit" disabled={submitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3.5 rounded-full transition-all shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: programColor, boxShadow: `0 10px 25px -10px ${programColor}` }}
                >
                  {submitting ? 'Submitting…' : 'Notify Me'}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">You're on the list! 🎉</h3>
              <p className="text-sm text-gray-500 mb-6">We'll email you the moment <span className="font-semibold">{programName}</span> lessons are live.</p>
              <button onClick={handleClose} className="text-sm font-bold hover:underline" style={{ color: programColor }}>
                Done
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};