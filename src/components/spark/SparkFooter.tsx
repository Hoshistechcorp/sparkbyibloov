import React from 'react';
import sparkLogo from '@/assets/spark-logo.svg';

export const SparkFooter = () => (
  <footer className="border-t border-gray-100 py-12 px-6 md:px-12 bg-gray-50">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <img src={sparkLogo} alt="Spark" className="h-6 w-6" />
          <span className="text-sm font-extrabold tracking-[0.15em] uppercase text-gray-900">Spark</span>
        </div>
        <p className="text-[11px] text-gray-400 tracking-wide">A product of iBloov Learning</p>
        <p className="text-[11px] text-gray-300 mt-1">© {new Date().getFullYear()} iBloov. All rights reserved.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { title: 'Programs', links: ['Event Planning', 'Mixology', 'DJ Arts', 'All Programs'] },
          { title: 'For You', links: ['Learners', 'Partners', 'Experts'] },
          { title: 'Company', links: ['About iBloov', 'Careers', 'Press', 'Contact'] },
          { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-[10px] tracking-[0.2em] uppercase text-gray-300 mb-3 font-bold">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[12px] text-gray-400 hover:text-[#65A300] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </footer>
);
