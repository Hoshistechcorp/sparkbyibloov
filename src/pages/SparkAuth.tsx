import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import sparkLogo from '@/assets/spark-logo.svg';
import { SparkReferDialog } from '@/components/spark/SparkReferDialog';
import { Eye, EyeOff } from 'lucide-react';

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

const bgImages = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=600&fit=crop&q=80',
];

const SparkAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referOpen, setReferOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mode !== 'forgot') {
        navigate('/spark/profile');
      }
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!');
      navigate('/spark/my-programs');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    if (!country.trim()) {
      toast.error('Please enter your location');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const selectedInterests = interests.map(i => i === 'Other (Please specify below)' ? otherInterest : i).filter(Boolean);
      const { error } = await supabase.auth.signUp({
        email,
        password,
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/spark/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
      setMode('login');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'forgot') {
      return (
        <motion.div key="forgot" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-1">Reset password</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80"
                placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all disabled:opacity-50">
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <p className="text-center text-sm text-gray-500">
              <button type="button" onClick={() => setMode('login')} className="text-[#ec9f00] font-bold hover:underline">Back to login</button>
            </p>
          </form>
        </motion.div>
      );
    }

    if (mode === 'login') {
      return (
        <motion.div key="login" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Log in to continue your learning journey.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80 pr-12"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <button type="button" onClick={() => setMode('forgot')} className="text-xs text-[#ec9f00] font-bold mt-1.5 hover:underline">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all disabled:opacity-50">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('signup')} className="text-[#ec9f00] font-bold hover:underline">Sign up</button>
            </p>
          </form>
        </motion.div>
      );
    }

    // Signup mode
    return (
      <motion.div key="signup" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-1">Start your journey</h1>
        <p className="text-sm text-gray-500 mb-6">Create your free account and start learning.</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80"
              placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80 pr-12"
                placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">What interests you? <span className="normal-case font-normal text-gray-400">(select all)</span></label>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map(opt => {
                const selected = interests.includes(opt);
                return (
                  <button key={opt} type="button"
                    onClick={() => setInterests(prev => prev.includes(opt) ? prev.filter(i => i !== opt) : [...prev, opt])}
                    className={`relative text-left px-3 py-2.5 rounded-xl border-2 transition-all text-xs leading-snug font-medium ${
                      selected ? 'border-[#ec9f00] bg-[#ec9f00]/10 text-gray-900 shadow-sm' : 'border-gray-200 bg-white/80 text-gray-600 hover:border-gray-300'
                    }`}>
                    {selected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#ec9f00] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          {interests.includes('Other (Please specify below)') && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Please specify</label>
              <input type="text" value={otherInterest} onChange={e => setOtherInterest(e.target.value)} required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80"
                placeholder="Tell us what interests you" />
            </motion.div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Location</label>
            <input type="text" value={country} onChange={e => setCountry(e.target.value)} required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#ec9f00] focus:outline-none transition-colors bg-white/80"
              placeholder="City, Country" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-[#d48e00] transition-all disabled:opacity-50">
            {loading ? 'Please wait…' : 'Get Started'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button type="button" onClick={() => setMode('login')} className="text-[#ec9f00] font-bold hover:underline">Log in</button>
          </p>
        </form>
      </motion.div>
    );
  };

  return (
    <>
      <SEOHead title="Join Spark — Start Learning" description="Join Spark by iBloov Learning." />
      <div className="min-h-screen font-[Nunito] flex flex-col md:flex-row relative">
        {/* Left side — Hero visual */}
        <div className="hidden md:block md:w-1/2 lg:w-[55%] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img key={currentBgIndex} src={bgImages[currentBgIndex]} alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }} />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col justify-end p-10 lg:p-14">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#ec9f00] font-bold mb-4 block">
                Micro-Credentials · Hospitality · Events · Tourism
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight mb-4">
                Learn what<br />
                <span className="text-[#ec9f00]">actually matters.</span>
              </h2>
              <p className="text-sm lg:text-base text-white/70 max-w-md leading-relaxed">
                World-class education meets real-world skills. Stackable credentials for the next generation of industry leaders.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mobile background */}
        <div className="md:hidden absolute inset-0">
          <img src={bgImages[currentBgIndex]} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/90" />
        </div>

        {/* Right side — Form */}
        <div className="relative z-10 flex-1 flex flex-col min-h-screen">
          <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none border-b border-gray-100 md:border-none">
            <Link to="/spark" className="flex items-center gap-2 md:gap-3">
              <img src={sparkLogo} alt="Spark" className="h-8 w-8 md:h-10 md:w-10" />
              <span className="text-sm md:text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
            </Link>
            <Link to="/spark" className="text-[11px] tracking-[0.1em] uppercase font-bold text-gray-400 hover:text-[#ec9f00] transition-colors">
              ← Back
            </Link>
          </nav>

          <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-12 py-8 md:py-12 overflow-y-auto">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ec9f00]/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#ec9f00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gray-900 mb-3">You're in! 🎉</h1>
                  <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed">
                    We've sent a confirmation to <span className="font-bold text-gray-900">{email}</span>. Check your inbox to get started.
                  </p>
                  <button onClick={() => setReferOpen(true)}
                    className="w-full bg-gray-900 text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:bg-gray-800 transition-all mb-4 flex items-center justify-center gap-3">
                    Refer a Friend
                  </button>
                  <Link to="/spark" className="inline-block text-sm font-bold text-[#ec9f00] hover:underline mt-2">← Back to Spark</Link>
                </motion.div>
              ) : renderForm()}
            </AnimatePresence>
          </div>
        </div>
        <SparkReferDialog open={referOpen} onClose={() => setReferOpen(false)} />
      </div>
    </>
  );
};

export default SparkAuth;
