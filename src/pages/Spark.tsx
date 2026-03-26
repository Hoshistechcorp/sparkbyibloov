import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import sparkLogo from '@/assets/spark-logo.svg';
import { SparkHero } from '@/components/spark/SparkHero';
import { SparkMarquee } from '@/components/spark/SparkMarquee';
import { SparkAudience } from '@/components/spark/SparkAudience';
import { SparkDNA } from '@/components/spark/SparkDNA';
import { SparkPartners } from '@/components/spark/SparkPartners';
import { SparkCTA } from '@/components/spark/SparkCTA';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Spark = () => {
  return (
    <>
      <SEOHead
        title="Spark — Learn What Actually Matters"
        description="Spark by iBloov Learning combines world-class education with real-world hospitality, events & tourism skills. Micro-credentials for the next generation of industry leaders."
        keywords="spark, ibloov, learning, hospitality, events, tourism, micro-credentials"
      />
      <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden font-[Nunito]">
        <SparkNav />
        <SparkHero />
        <SparkMarquee />

        {/* Programs teaser */}
        <section className="py-12 md:py-20 px-4 md:px-12 max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#c48500] font-bold mb-3 block"
          >
            Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-[#ec9f00] via-[#f59e0b] to-[#ef4444] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Spark Programs.
            </motion.span>{' '}
            <motion.span
              className="inline-block bg-gradient-to-r from-gray-900 via-[#ec9f00] to-gray-900 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Zero fluff.
            </motion.span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-6 md:mb-8"
          >
            Stackable micro-credentials in hospitality, events & tourism. Each one designed to be your unfair advantage.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              to="/spark/programs"
              className="inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-[#d48e00] transition-all shadow-lg shadow-[#ec9f00]/25 hover:scale-105"
            >
              Explore All Programs →
            </Link>
          </motion.div>
        </section>

        <SparkAudience />
        <SparkDNA />
        <SparkPartners />
        <SparkCTA />
        <SparkFooter />
      </div>
    </>
  );
};

const SparkNav = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-3 md:py-4 bg-white/90 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="flex items-center gap-2 md:gap-3">
          <img src={sparkLogo} alt="Spark" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="text-sm md:text-base font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.12em] uppercase text-gray-500 font-semibold">
          <Link to="/spark/programs" className="hover:text-[#c48500] transition-colors">Programs</Link>
          <Link to="/spark/events" className="hover:text-[#c48500] transition-colors">Events</Link>
          <a href="#audiences" className="hover:text-[#c48500] transition-colors">For You</a>
          <Link to="/spark/news" className="hover:text-[#c48500] transition-colors">News</Link>
          <Link to="/spark/media" className="hover:text-[#c48500] transition-colors">Media</Link>
          <Link to="/spark/admin" className="hover:text-[#c48500] transition-colors">Admin</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/spark/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ec9f00] text-white text-[10px] md:text-[11px] font-extrabold tracking-[0.12em] uppercase px-4 md:px-5 py-2 md:py-2.5 rounded-full hover:bg-[#d48e00] transition-colors shadow-sm"
            >
              Get Started
            </motion.button>
          </Link>
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-1 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <img src={sparkLogo} alt="Spark" className="h-8 w-8" />
              <span className="text-sm font-black tracking-[0.15em] uppercase text-gray-900">Spark</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {[
              { to: '/spark/programs', label: 'Programs' },
              { to: '/spark/events', label: 'Events' },
              { to: '/spark/news', label: 'News' },
              { to: '/spark/media', label: 'Media' },
              { to: '/spark/partners', label: 'Partners' },
              { to: '/spark/admin', label: 'Admin' },
            ].map((link, i) => (
              <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={link.to} onClick={() => setMobileOpen(false)} className="text-2xl font-bold tracking-wide text-gray-900">
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link to="/spark/auth" onClick={() => setMobileOpen(false)} className="mt-4 inline-block bg-[#ec9f00] text-white font-extrabold text-sm tracking-[0.08em] uppercase px-8 py-3 rounded-full">
                Get Started
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Spark;
