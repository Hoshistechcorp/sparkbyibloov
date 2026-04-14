import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import sparkLogo from '@/assets/spark-logo.svg';
import { Menu, X, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SparkSubNavProps {
  activeLink?: string;
}

const navLinks = [
  { to: '/spark', label: 'Home' },
  { to: '/spark/programs', label: 'Programs' },
  { to: '/spark/events', label: 'Events' },
  { to: '/spark/news', label: 'News' },
  { to: '/spark/media', label: 'Media' },
];

export const SparkSubNav: React.FC<SparkSubNavProps> = ({ activeLink }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '';
        setUserInitials(name.slice(0, 2).toUpperCase());
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '';
        setUserInitials(name.slice(0, 2).toUpperCase());
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
        setIsAdmin(!!data);
      }
    };
    if (isLoggedIn) checkAdmin();
  }, [isLoggedIn]);

  const allLinks = [
    ...navLinks,
    ...(isLoggedIn ? [{ to: '/spark/my-programs', label: 'My Programs' }] : []),
    ...(isAdmin ? [{ to: '/spark/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-3 md:py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <Link to="/spark" className="flex items-center gap-2 md:gap-3">
          <img src={sparkLogo} alt="Spark" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="text-sm md:text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-gray-500 font-semibold">
          {allLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`hover:text-[#c48500] transition-colors ${activeLink === link.label.toLowerCase() ? 'text-[#c48500]' : ''}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link to="/spark/profile" className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-[#ec9f00] text-white text-xs font-black tracking-wide hover:bg-[#d48e00] transition-colors">
              {userInitials}
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/spark/auth?mode=login"
                className="text-[11px] font-bold tracking-[0.08em] uppercase text-gray-600 hover:text-[#ec9f00] transition-colors px-4 py-2">
                Log In
              </Link>
              <Link to="/spark/auth?mode=signup"
                className="bg-[#ec9f00] text-white text-[11px] font-extrabold tracking-[0.12em] uppercase px-5 py-2.5 rounded-full hover:bg-[#d48e00] transition-colors shadow-sm">
                Sign Up
              </Link>
            </div>
          )}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-gray-700">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <Link to="/spark" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <img src={sparkLogo} alt="Spark" className="h-8 w-8" />
                <span className="text-sm font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {allLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={link.to} onClick={() => setMobileOpen(false)}
                    className={`text-2xl font-bold tracking-wide ${activeLink === link.label.toLowerCase() ? 'text-[#c48500]' : 'text-gray-900'}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {isLoggedIn ? (
                  <Link to="/spark/profile" onClick={() => setMobileOpen(false)}
                    className="mt-4 inline-flex items-center gap-2 bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                ) : (
                  <div className="flex flex-col items-center gap-3 mt-4">
                    <Link to="/spark/auth?mode=login" onClick={() => setMobileOpen(false)}
                      className="text-lg font-bold text-gray-600 hover:text-[#ec9f00] transition-colors">
                      Log In
                    </Link>
                    <Link to="/spark/auth?mode=signup" onClick={() => setMobileOpen(false)}
                      className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full">
                      Sign Up
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
