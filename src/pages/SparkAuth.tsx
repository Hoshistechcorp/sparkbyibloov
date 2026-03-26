import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import sparkLogo from '@/assets/spark-logo.svg';

const INTEREST_OPTIONS = [
  'Advanced Event Planning and Management with Creative Event Organizing',
  'Tourist Guide Professional',
  'Mixology & Bartending Techniques',
  'Concierge Services',
  'Orators / Public Speaking',
  'Storyteller / Narrative Design',
  'Visual Storytelling (Photography and Videography)',
  'DJ/Music Production',
  'Other (Please specify below)',
];

const SparkAuth = () => {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    if (!country.trim()) {
      toast.error('Please enter your country');
      return;
    }
    setLoading(true);
    try {
      const selectedInterests = interests.map(i => i === 'Other (Please specify below)' ? otherInterest : i).filter(Boolean);
      const { error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(),
        options: {
          data: { interest: selectedInterests.join(', '), country: country.trim() },
          emailRedirectTo: window.location.origin + '/spark',
        },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReferFriend = () => {
    const referralLink = `${window.location.origin}/spark/auth`;
    const text = `Join Spark and start learning skills that actually matter! Sign up here: ${referralLink}`;
    if (navigator.share) {
      navigator.share({ title: 'Join Spark', text, url: referralLink }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setReferralCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setReferralCopied(false), 3000);
      });
    }
  };

  return (
    <>
      <SEOHead title="Join Spark — Start Learning" description="Join Spark by iBloov Learning." />
      <div className="min-h-screen bg-white font-[Nunito] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-12 py-3 md:py-4 border-b border-gray-100">
          <Link to="/spark" className="flex items-center gap-2 md:gap-3">
            <img src={sparkLogo} alt="Spark" className="h-8 w-8 md:h-10 md:w-10" />
            <span className="text-sm md:text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
          </Link>
          <Link to="/spark" className="text-[11px] tracking-[0.1em] uppercase font-bold text-gray-400 hover:text-[#ec9f00] transition-colors">
            ← Back
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-10 md:py-16">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 mb-2">
                  Start your journey
                </h1>
                <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
                  Create your free account and start learning what actually matters.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">What interests you? <span className="normal-case font-normal text-gray-400">(select all that apply)</span></label>
                    <div className="space-y-2 border-2 border-gray-200 rounded-xl p-4 max-h-56 overflow-y-auto">
                      {INTEREST_OPTIONS.map(opt => (
                        <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={interests.includes(opt)}
                            onChange={() => {
                              setInterests(prev =>
                                prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt]
                              );
                            }}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#ec9f00] accent-[#ec9f00] focus:ring-[#ec9f00]"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {interest === 'Other (Please specify below)' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Please specify</label>
                      <input
                        type="text"
                        value={otherInterest}
                        onChange={e => setOtherInterest(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors"
                        placeholder="Tell us what interests you"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">LOCATION</label>
                    <input
                      type="text"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors"
                      placeholder="e.g. Nigeria, United States"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25 disabled:opacity-50"
                  >
                    {loading ? 'Please wait...' : 'Get Started'}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ec9f00]/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#ec9f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 mb-3">
                  You're in! 🎉
                </h1>
                <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed">
                  We've sent a confirmation to <span className="font-bold text-gray-900">{email}</span>. Check your inbox to get started with Spark.
                </p>

                <motion.button
                  onClick={handleReferFriend}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-900 text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-800 transition-all shadow-lg mb-4 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {referralCopied ? 'Link Copied!' : 'Refer a Friend'}
                </motion.button>

                <Link
                  to="/spark"
                  className="inline-block text-sm font-bold text-[#ec9f00] hover:underline mt-2"
                >
                  ← Back to Spark
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default SparkAuth;
