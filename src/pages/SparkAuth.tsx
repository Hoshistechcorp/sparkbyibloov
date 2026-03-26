import React, { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import sparkLogo from '@/assets/spark-logo.svg';

const SparkAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin } });
        if (error) throw error;
        toast.success('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/spark');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title={isSignUp ? 'Join Spark — Start Learning' : 'Sign In — Spark'} description="Join Spark by iBloov Learning." />
      <div className="min-h-screen bg-white font-[Nunito] flex flex-col">
        <nav className="flex items-center justify-between px-4 md:px-12 py-3 md:py-4 border-b border-gray-100">
          <Link to="/spark" className="flex items-center gap-2 md:gap-3">
            <img src={sparkLogo} alt="Spark" className="h-8 w-8 md:h-10 md:w-10" />
            <span className="text-sm md:text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
          </Link>
          <Link to="/spark" className="text-[11px] tracking-[0.1em] uppercase font-bold text-gray-400 hover:text-[#c48500] transition-colors">
            ← Back
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 mb-2">
              {isSignUp ? 'Start your journey' : 'Welcome back'}
            </h1>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">
              {isSignUp ? 'Create your free account and start learning what actually matters.' : 'Sign in to continue your learning journey.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors" placeholder="you@example.com" />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25 disabled:opacity-50">
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#c48500] font-bold hover:underline">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SparkAuth;
