import React from 'react';
import { SEOHead } from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import sparkLogo from '@/assets/spark-logo.svg';
import { Navbar } from '@/components/Navbar';
import { SparkFooter } from '@/components/spark/SparkFooter';
import { Building2, GraduationCap, Globe, Users, ArrowRight } from 'lucide-react';

const partnerTypes = [
  {
    icon: GraduationCap,
    title: 'Academic Partners',
    description: 'Universities and training institutions looking to offer industry-aligned micro-credentials to their students.',
    benefits: ['Co-branded certifications', 'Curriculum integration', 'Student pipeline access', 'Revenue sharing model'],
    cta: 'Partner as an Institution',
    color: '#CCFF00',
  },
  {
    icon: Building2,
    title: 'Employer Partners',
    description: 'Hotels, event companies, and tourism brands seeking to upskill their workforce with real-world training.',
    benefits: ['Custom training paths', 'Workforce analytics dashboard', 'Talent pipeline access', 'Bulk enrollment pricing'],
    cta: 'Partner as an Employer',
    color: '#7BFF60',
  },
  {
    icon: Users,
    title: 'Industry Experts',
    description: 'Seasoned professionals who want to teach, mentor, and shape the next generation of hospitality leaders.',
    benefits: ['Build your personal brand', 'Earn from your expertise', 'Global learner reach', 'Flexible content creation'],
    cta: 'Become an Expert',
    color: '#00C896',
  },
  {
    icon: Globe,
    title: 'Municipal & Government',
    description: 'Cities and governments preparing communities for mega events like FIFA, Olympics, and World Expos.',
    benefits: ['City-wide training programs', 'Tourism readiness certification', 'Community impact reports', 'Event workforce planning'],
    cta: 'Partner as a City',
    color: '#65A300',
  },
];

const SparkPartners = () => {
  return (
    <>
      <SEOHead
        title="Partner With Spark — iBloov Learning"
        description="Join the Spark partner ecosystem. Academic institutions, employers, industry experts, and cities — build the future of hospitality education together."
      />
      <div className="bg-white text-gray-900 min-h-screen font-[Nunito]">
        <Navbar />

        {/* Hero */}
        <section className="pt-32 pb-20 px-6 md:px-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FFE8] via-white to-white" />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#CCFF00]/15 blur-[120px]"
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] tracking-[0.3em] uppercase text-[#65A300] font-bold mb-4 block"
            >
              Partnerships
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            >
              Let's build the future{' '}
              <span className="bg-gradient-to-r from-[#CCFF00] via-[#7BFF60] to-[#00C896] bg-clip-text text-transparent">
                together.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-500 max-w-xl mx-auto"
            >
              Whether you're an institution, employer, expert, or city — there's a seat at the table for you.
            </motion.p>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {partnerTypes.map((partner, i) => (
              <motion.div
                key={partner.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group border-2 border-gray-100 rounded-2xl p-8 hover:border-[#CCFF00] transition-all duration-300 hover:shadow-xl hover:shadow-[#CCFF00]/10"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${partner.color}20` }}
                >
                  <partner.icon className="w-6 h-6" style={{ color: partner.color }} />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-3">{partner.title}</h3>
                <p className="text-gray-500 mb-6">{partner.description}</p>
                <ul className="space-y-2 mb-8">
                  {partner.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-gray-900 text-white font-bold text-sm tracking-wide uppercase px-6 py-3 rounded-full group-hover:bg-[#CCFF00] group-hover:text-gray-900 transition-all"
                >
                  {partner.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              Ready to make an{' '}
              <span className="bg-gradient-to-r from-[#CCFF00] to-[#00C896] bg-clip-text text-transparent">
                impact?
              </span>
            </h2>
            <p className="text-gray-500 mb-8">
              Get in touch with our partnerships team and let's explore what we can build together.
            </p>
            <Link
              to="/spark/auth"
              className="inline-block bg-[#CCFF00] text-gray-900 font-extrabold text-sm tracking-[0.08em] uppercase px-10 py-4 rounded-full hover:bg-[#B8E600] transition-all shadow-lg shadow-[#CCFF00]/25"
            >
              Get Started Today
            </Link>
          </motion.div>
        </section>

        <SparkFooter />
      </div>
    </>
  );
};

export default SparkPartners;
